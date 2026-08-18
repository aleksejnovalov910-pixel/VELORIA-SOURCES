import { In, Like } from "typeorm";
import { FACTION_ID } from "../../../shared/fractions";
import { CustomEvent } from "../custom.event";
import { gui } from "../gui";
import { system } from "../system";
import { FactionIncident } from "../typeorm/entities/faction.incident";
import { UserEntity } from "../typeorm/entities/user";
import { User } from "../user";
import { CallList, ICarForm, IMandate, MdtInfo, ICriminal, Incident, ICitizenDetails, ICriminalResponse, IMandateResponse, IncidentResponse, ResponseType, ICreator } from '../../../shared/mdt';
import { FactionMandate } from "../typeorm/entities/faction.mandate";
import { Dispatch } from "../dispatch";
import { FactionCriminal } from "../typeorm/entities/faction.criminal";
import { user } from "modules/user";
import { FactionCar } from "../typeorm/entities/faction.car";
import { VehicleEntity } from "../typeorm/entities/vehicle";
import { VehicleConfigsEntity } from "../typeorm/entities/vehicle.configs";
import { inventory } from "../inventory";
import { OWNER_TYPES } from "../../../shared/inventory";

const fractionID = [FACTION_ID.LSPD, FACTION_ID.SHERIFF];

const zones = [
  { name: "Центр города", x: 0, y: 0, radius: 1000 },
  { name: "Северный район", x: 0, y: 1000, radius: 1000 },
  { name: "Южный район", x: 0, y: -1000, radius: 1000 },
  { name: "Западный район", x: -1000, y: 0, radius: 1000 },
  { name: "Восточный район", x: 1000, y: 0, radius: 1000 }
];

class MDT {
  private mandates: Set<FactionMandate> = new Set();
  private criminals: Set<FactionCriminal> = new Set();
  private incidents: Set<FactionIncident> = new Set();
  private cars: Set<FactionCar> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    gui.chat.registerCommand("mdt", this.openTablet.bind(this))
    CustomEvent.registerClient("mdt:openTablet", this.openTablet.bind(this))

    this.subscribeToEvents();
  }

  public async loadMdt() {
    await this.loadMandates();
    await this.loadCriminals();
    await this.loadIncidents();
    await this.loadCars();
  }

  private loadMandates() {
    FactionMandate.find().then((mandates) => {
      this.mandates = new Set(mandates);
    });
  }

  private loadCriminals() {
    FactionCriminal.find().then((criminals) => {
      this.criminals = new Set(criminals);
    });
  }

  private loadIncidents() {
    FactionIncident.find().then((incidents) => {
      this.incidents = new Set(incidents);
    });
  }

  private loadCars() {
    FactionCar.find().then((cars) => {
      this.cars = new Set(cars);
    });
  }

  private openTablet(player: PlayerMp) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    CustomEvent.triggerClient(player, "mdt:openTablet");
  }

  getMembers(player: PlayerMp) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const faction = player.user.fractionData;

    const array = mp.players.toArray().filter(p => p.user && p.user.fraction == player.user.fraction);


    return array.map(p => {
      const phoneNumber = inventory
        .getInventory(OWNER_TYPES.PLAYER, p.user.id)
        .filter((item) => item.item_id === 850 && item.advancedNumber)
        .map((q) => q.advancedNumber)[0];

      return {
        id: p.user.id,
        name: p.user.entity.rp_name,
        rank: p.user.rank,
        serviceLife: system.formatTime(system.timestamp - p.user.entity.date_auth),
        description: p.user.tag,
        location: this.getLocationName(p.position),
        date: system.timeStampStringDate(system.timestamp),
        phoneNumber: phoneNumber
      }
    })
  }

  private async getMandate(player: PlayerMp, target: string): Promise<IMandateResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      let userId = null;
      let user = null;

      if (this.isNumber(target)) {
        userId = Number(target);
      }
      else {
        user = await UserEntity.findOne({ where: { rp_name: target } });
        if (!user) return;
        userId = user.id;
      }

      // Find all mandates that contain the user ID
      const mandates = Array.from(this.mandates).filter(m =>
        m.usersId && m.usersId.some(id => Number(id) === userId)
      );
      if (!mandates.length) return [];

      // Map the mandates to the expected format
      const response = mandates.map(async (mandate) => {
        const creator = await this.getCreator(mandate.creatorId);

        return {
          id: mandate.id,
          userId: userId,
          name: user ? user.rp_name : User.get(userId)?.user?.name || "",
          orderTitle: mandate.orderTitle,
          orderTime: mandate.orderTime,
          personsInvolved: mandate.personsInvolved,
          orderType: mandate.orderType,
          address: mandate.address,
          description: mandate.description,
          proofs: mandate.proofs,
          signature: ResponseType.Mandate,
          date: new Date(mandate.createdAt),
          creator: creator || undefined
        }
      });

      return await Promise.all(response);
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getAllMandates(player: PlayerMp, dataString: string): Promise<IMandateResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const data = JSON.parse(dataString);

    try {
      const mandates = Array.from(this.mandates);
      if (!mandates.length) return [];

      data.page = Number(data.page);
      data.limit = Number(data.limit);


      const start = data.page * data.limit;
      const end = start + data.limit;

      console.log(start, end, data.page, data.limit, data);

      const response = await Promise.all(mandates.slice(start, end).map(async mandate => {
        const creator = await this.getCreator(mandate.creatorId);

        const user = await UserEntity.findOne({ where: { id: mandate.usersId[0] } });
        if (!user) return;

        return {
          id: mandate.id,
          userId: user.id,
          name: user.rp_name,
          orderTitle: mandate.orderTitle,
          orderTime: mandate.orderTime,
          personsInvolved: mandate.personsInvolved,
          orderType: mandate.orderType,
          address: mandate.address,
          description: mandate.description,
          proofs: mandate.proofs,
          signature: ResponseType.Mandate,
          date: new Date(mandate.createdAt),
          creator: creator || undefined
        }
      }));

      const parsed = response.filter((item) => item != undefined);
      console.log(parsed.length);
      return parsed;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getIncidents(player: PlayerMp): Promise<IncidentResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const incidents = Array.from(this.incidents);

      const response = incidents.map(incident => ({
        id: incident.id,
        orderTitle: incident.orderTitle,
        userId: Number(incident.usersId[0]),
        name: incident.personsInvolved,
        orderTime: incident.orderTime,
        personsInvolved: incident.personsInvolved.split(','),
        policeOfficersInvolved: incident.policeOfficersInvolved ? incident.policeOfficersInvolved.split(',') : [],
        vehiclesInvolved: incident.vehiclesInvolved,
        description: incident.description,
        proofs: incident.proofs,
        signature: ResponseType.Incident,
        date: new Date(incident.createdAt)
      }));

      return response;
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getMandatesCount(player: PlayerMp) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const mandates = Array.from(this.mandates).length;

      return mandates;
    }
    catch (error) {
      console.error(error);
    }
  }

  private async getIncidentsCount(player: PlayerMp) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const incidents = Array.from(this.incidents).length;

      return incidents;
    }
    catch (error) {
      console.error(error);
    }
  }

  private async getCreator(userId: number): Promise<ICreator | null> {
    if (!userId || isNaN(Number(userId))) return null;


    try {
      let target = User.get(Number(userId));
      if (!target) {
        const dbUser = await UserEntity.findOne({ where: { id: Number(userId) } });

        if (!dbUser) return null;

        return {
          userId: dbUser.id,
          name: dbUser.rp_name,
          rank: dbUser.rank,
          fractionId: dbUser.fraction,
        };
      }

      return {
        userId: target?.user?.id,
        name: target?.user?.entity?.rp_name,
        rank: target?.user?.rank,
        fractionId: target?.user?.fraction,
      };
    } catch (error) {
      return null;
    }
  }

  private getOfficersList(player: PlayerMp, infoType: string) {
    console.log('get officers list');
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    switch (infoType) {
      case "members":
        return this.getMembers(player).map((item) => {
          return {
            id: item.id,
            name: item.name,
            serviceLife: item.serviceLife,
            rank: item.rank,
          }
        })

      case "calls":
        return this.getCalls(player.user.fraction).map((item) => {
          return {
            id: item.id,
            name: item.fromPlayer?.user?.entity?.rp_name,
            description: "",
            date: system.timeStampString(item.timestamp, false),
            location: item.location || this.getLocationName(new mp.Vector3(item.pos[0], item.pos[1], 0))
          }
        })
    }
  }

  private async getLatestMandates(): Promise<IMandateResponse[]> {
    try {
      const mandates = Array.from(this.mandates).reverse().slice(0, 3);
      const response = mandates.map(async (mandate) => {
        const creator = await this.getCreator(Number(mandate.creatorId));
        return {
          id: mandate.id,
          userId: Number(mandate.usersId[0]),
          orderTitle: mandate.orderTitle,
          orderTime: mandate.orderTime,
          personsInvolved: mandate.personsInvolved,
          orderType: mandate.orderType,
          address: mandate.address,
          description: mandate.description,
          proofs: mandate.proofs,
          signature: ResponseType.Mandate,
          name: Array.isArray(mandate.personsInvolved) ? mandate.personsInvolved.join(', ') : String(mandate.personsInvolved),
          date: new Date(mandate.createdAt),
          creator: creator || undefined
        }
      });

      return await Promise.all(response);
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getLatestIncidents(): Promise<IncidentResponse[]> {
    try {
      const incidents = Array.from(this.incidents).reverse().slice(0, 3);
      const promises = incidents.map(async (incident) => {
        const creator = await this.getCreator(Number(incident.creatorId));
        const user = await UserEntity.findOne({ where: { id: Number(incident.usersId[0]) } });

        return {
          id: incident.id,
          userId: user?.id,
          orderTitle: incident.orderTitle,
          name: user?.rp_name || "",
          orderTime: incident.orderTime,
          personsInvolved: typeof incident.personsInvolved === 'string' ? [incident.personsInvolved] : incident.personsInvolved,
          policeOfficersInvolved: Array.isArray(incident.policeOfficersInvolved) ? incident.policeOfficersInvolved : (incident.policeOfficersInvolved ? [incident.policeOfficersInvolved] : []),
          vehiclesInvolved: incident.vehiclesInvolved,
          description: incident.description,
          proofs: incident.proofs,
          signature: ResponseType.Incident,
          date: new Date(incident.createdAt),
          creator: creator || undefined
        }
      });

      return await Promise.all(promises);
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getLatestCriminals(): Promise<ICriminalResponse[]> {
    try {
      const criminals = Array.from(this.criminals);
      const size = criminals.length;

      if (size === 0) return [];

      // Get the last 5 criminals (or all if less than 5)
      const latestCriminals = criminals
        .reverse()
        .slice(0, 3);

      const promises = latestCriminals.map(async (item) => {
        const user = await UserEntity.findOne({ where: { id: item.userId } });
        const creator = await this.getCreator(Number(item.policeUsersId[0]));
        return {
          id: item.id,
          userId: item.userId,
          name: user?.rp_name || "",
          description: item.description,
          proofs: item.proofs,
          signature: ResponseType.Criminal,
          date: new Date(item.createdAt),
          paid: item.paid,
          creator: creator || undefined
        };
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error("Error getting latest criminals:", error);
      return [];
    }
  }

  private async getInfoMain(player: PlayerMp): Promise<MdtInfo | string> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const countMandates = await FactionMandate.count();
      const countPlayers = mp.players.toArray().filter(p => p.user && p.user.fraction == player.user.fraction).length;

      const latestCriminals = await this.getLatestCriminals();
      const latestMandates = await this.getLatestMandates();
      const latestIncidents = await this.getLatestIncidents();

      const object: MdtInfo = {
        officers: countPlayers,
        mandates: countMandates,
        calls: (this.getCalls(player.user.fraction)).length,
        // latest: {
        //   criminal: latestCriminals,
        //   mandates: latestMandates,
        //   incidents: latestIncidents
        // }
      }

      CustomEvent.triggerCef(player, "Mdt-SetCriminal", JSON.stringify(latestCriminals));
      CustomEvent.triggerCef(player, "Mdt-SetMandate", JSON.stringify(latestMandates));
      CustomEvent.triggerCef(player, "Mdt-SetIncident", JSON.stringify(latestIncidents));

      return object;
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  private async addMandate(player: PlayerMp, dataString: string) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const data: IMandate = JSON.parse(dataString);

    try {
      const nickNames: string[] = data.personsInvolved;

      const exist: UserEntity[] = [];

      if (exist.length != nickNames.length) {
        await UserEntity.find({
          where: {
            id: In(nickNames)
          }
        }).then((users) => {
          users.forEach((user) => {
            exist.push(user);
          })
        })
      }

      const mandate = new FactionMandate();

      mandate.orderTime = data.orderTime;
      mandate.personsInvolved = nickNames;
      mandate.orderType = data.orderType;
      mandate.address = data.address;
      mandate.description = data.description;
      mandate.proofs = data.proofs;
      mandate.signature = data.signature;
      mandate.orderTitle = data.orderTitle;
      mandate.creatorId = player?.user?.id;

      mandate.usersId = exist.map((user) => user.id);

      const savedMandate = await mandate.save();

      if (!savedMandate) return false;

      this.mandates.add(savedMandate);

      return true;
    }
    catch (error) {
      console.error(error);

      return false;
    }
  }

  private getCalls(factionID: number) {
    return Dispatch.getFactionDispatches(factionID);
  }

  private getLocationName(location: Vector3Mp): string {
    try {
      for (const zone of zones) {
        const distance = Math.sqrt(
          Math.pow(location.x - zone.x, 2) +
          Math.pow(location.y - zone.y, 2)
        );

        if (distance <= zone.radius) {
          return zone.name;
        }
      }

      return "Неизвестный район";
    } catch (error) {
      return "Неизвестный район";
    }
  }

  private async addIncident(player: PlayerMp, dataString: string) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const data: Incident = JSON.parse(dataString);

    try {
      const nickNames: string[] = data.personsInvolved;

      const exist: UserEntity[] = [];

      await UserEntity.find({
        where: {
          id: In(nickNames)
        }
      }).then((users) => {
        users.forEach((user) => {
          exist.push(user);
        })
      })

      const policeOfficers = [];

      await UserEntity.find({
        where: {
          id: In(data.policeOfficersInvolved)
        }
      }).then((users) => {
        users.forEach((user) => {
          policeOfficers.push(user);
        })
      })

      const incident = new FactionIncident();

      incident.orderTitle = data.orderTitle;
      incident.orderTime = data.orderTime;
      incident.personsInvolved = nickNames.join(",");
      incident.policeOfficersInvolved = data.policeOfficersInvolved.join(",");
      incident.vehiclesInvolved = data.vehiclesInvolved;
      incident.description = data.description;
      incident.proofs = data.proofs;
      incident.signature = data.signature;
      incident.creatorId = player.user.id;

      incident.usersId = exist.map((user) => user.id.toString());
      incident.policeUsersId = policeOfficers.map((user) => user.id.toString());

      const savedIncident = await incident.save();

      if (!savedIncident) return false;

      this.incidents.add(savedIncident);

      return true;
    }
    catch (error) {
      console.error(error);

      return false;
    }
  }

  private async addCriminalRecords(player: PlayerMp, dataString: string) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const data: ICriminal = JSON.parse(dataString);

    try {
      const user = await UserEntity.findOne({ where: { id: data.userId } });

      if (!user) return;

      const criminal = new FactionCriminal();

      criminal.userId = user.id;
      criminal.policeUsersId = [player.user.entity.id.toString()];
      criminal.description = data.description;
      criminal.proofs = data.proofs;
      criminal.signature = data.signature;
      criminal.orderTime = new Date().toISOString();

      const savedCriminal = await criminal.save();

      if (!savedCriminal) return false;

      this.criminals.add(savedCriminal);

      const targetPlayer = mp.players.toArray().find((c) => c.user.id == user.id);
      if (targetPlayer) {
        this.reloadCriminals(targetPlayer);
      }

      return true;
    }
    catch (e) {
      console.error(e);

      return false;
    }
  }

  private async getCar(player: PlayerMp, numberPlate: string) {
    if (!player.user || !player.user.fraction) return null;
    if (!fractionID.includes(player.user.fraction)) return null;

    try {
      const normalizedPlate = numberPlate.toUpperCase().trim();

      const car = Array.from(this.cars).find((car) =>
        car.carNumber.toUpperCase().trim() === normalizedPlate
      );
      if (!car) return null;

      let vehicleEntity = await VehicleEntity.findOne({
        where: { number: Like(normalizedPlate) }
      });

      if (!vehicleEntity) {
        vehicleEntity = await VehicleEntity.findOne({
          where: { number: Like(car.carNumber) }
        });
        if (!vehicleEntity) return null;
      }

      const owner = await UserEntity.findOne({ where: { id: vehicleEntity.userId } });
      if (!owner) return null;

      const vehicleConfig = await VehicleConfigsEntity.findOne({
        where: { model: vehicleEntity.model }
      });
      if (!vehicleConfig) return null;

      const creator = await this.getCreator(car.creatorId);

      return {
        id: car.id,
        plate: car.carNumber,
        name: vehicleConfig.name,
        owner: {
          name: owner.rp_name,
          userId: owner.id
        },
        elements: car.elements,
        date: car.createdAt,
        images: car.images,
        signature: ResponseType.Car,
        creator: creator || undefined
      };
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  private async getCitizen(player: PlayerMp, targetString: string): Promise<ICitizenDetails | null> {
    console.log('get citizen', targetString);
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const target = JSON.parse(targetString);
    if (!target) return;

    try {
      let userId = null;
      let user: UserEntity | null = null;

      if (this.isNumber(target)) {
        userId = Number(target);

        user = await UserEntity.findOne({ where: { id: userId } });
        if (!user) return;
      }
      else {
        user = await UserEntity.findOne({ where: { rp_name: Like(`%${target}%`) } });
        if (!user) return;
        userId = user.id;
      }

      const licenses = user.licenses.map((license) => {
        return {
          licenceType: license[0],
          date: new Date(system.timeStampStringDate(license[1]))
        }
      });

      // Get criminal records and convert to ICriminalResponse[]
      const criminalRecords = await this.searchCriminalRecord(player, user.rp_name) || [];

      // Get incidents and convert to IncidentResponse[]
      const incidents = await this.getIncident(player, user.rp_name) || [];

      // Get mandates and convert to IMandateResponse[]
      const mandates = await this.getMandate(player, user.rp_name) || [];

      const phoneNumber = inventory
        .getInventory(OWNER_TYPES.PLAYER, userId)
        .filter((item) => item.item_id === 850 && item.advancedNumber)
        .map((q) => q.advancedNumber)[0];

      const object: ICitizenDetails = {
        userId: user.id,
        name: user.rp_name,
        age: user.age,
        phone: phoneNumber?.toString(),
        licenses: licenses,
        criminalRecords: criminalRecords,
        incidents: incidents,
        mandates: mandates
      }

      return object;

    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  private async searchCriminalRecord(player: PlayerMp, target: string): Promise<ICriminalResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      let userId = null;
      let user = null;

      if (this.isNumber(target)) {
        userId = Number(target);
      }
      else {
        user = await UserEntity.findOne({ where: { rp_name: Like(`%${target}%`) } });
        if (!user) return;
        userId = user.id;
      }

      const criminals = Array.from(this.criminals).filter((criminal) => criminal.userId === userId);
      if (!criminals.length) return [];

      if (!user && userId) {
        user = await UserEntity.findOne({ where: { id: userId } });
      }

      const array = criminals.map(async (criminal) => {
        const creator = await this.getCreator(Number(criminal.policeUsersId[0]));
        return {
          id: criminal.id,
          userId: criminal.userId,
          name: user?.rp_name || "",
          description: criminal.description,
          proofs: criminal.proofs,
          signature: ResponseType.Criminal,
          date: new Date(criminal.createdAt),
          paid: criminal.paid,
          creator: creator || undefined
        }
      });

      return await Promise.all(array);
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  private async getIncident(player: PlayerMp, target: string): Promise<IncidentResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      let userId = null;
      let user = null;

      if (this.isNumber(target)) {
        userId = Number(target);
      }
      else {
        user = await UserEntity.findOne({ where: { rp_name: Like(`%${target}%`) } });
        if (!user) return;
        userId = user.id;
      }

      const userIdStr = String(userId);
      const incidents = Array.from(this.incidents).filter((incident) =>
        incident.usersId.some(id => Number(id) === userId)
      );

      if (!incidents.length) return [];

      return await Promise.all(incidents.map(async (incident) => {
        const creator = await this.getCreator(Number(incident.creatorId));
        return {
          id: incident.id,
          userId: userId,
          orderTitle: incident.orderTitle,
          name: user ? user?.rp_name : User.get(userId)?.user?.name || "",
          orderTime: incident.orderTime,
          personsInvolved: incident.personsInvolved.split(','),
          policeOfficersInvolved: incident.policeOfficersInvolved ? incident.policeOfficersInvolved.split(',') : [],
          vehiclesInvolved: incident.vehiclesInvolved,
          description: incident.description,
          proofs: incident.proofs,
          signature: ResponseType.Incident,
          date: new Date(incident.createdAt),
          creator: creator || undefined
        }
      }));
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  private async getAllIncidents(player: PlayerMp): Promise<IncidentResponse[]> {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const incidents = Array.from(this.incidents);
      if (!incidents.length) return [];

      const response = await Promise.all(incidents.map(async (incident) => {
        const creator = await this.getCreator(Number(incident.creatorId));
        const user = await UserEntity.findOne({ where: { id: Number(incident.usersId[0]) } });
        return {
          id: incident.id,
          userId: Number(incident.usersId[0]),
          name: user?.rp_name || "",
          orderTitle: incident.orderTitle,
          orderTime: incident.orderTime,
          personsInvolved: incident.personsInvolved.split(','),
          policeOfficersInvolved: incident.policeOfficersInvolved ? incident.policeOfficersInvolved.split(',') : [],
          vehiclesInvolved: incident.vehiclesInvolved,
          description: incident.description,
          proofs: incident.proofs,
          signature: ResponseType.Incident,
          date: new Date(incident.createdAt),
          creator: creator || undefined
        }
      }));

      return response;
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  private async getAllCriminals(player: PlayerMp, targetId: number) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    try {
      const criminals = Array.from(this.criminals);
      const size = criminals.length;

      if (size === 0) return [];

      // Get the last 5 criminals (or all if less than 5)
      const latestCriminals = criminals.filter((item) => item.userId == targetId);

      const promises = latestCriminals.map(async (item) => {
        const user = await UserEntity.findOne({ where: { id: item.userId } });
        const creator = await this.getCreator(Number(item.policeUsersId[0]));
        return {
          id: item.id,
          userId: item.userId,
          name: user?.rp_name || "",
          description: item.description,
          proofs: item.proofs,
          signature: ResponseType.Criminal,
          date: new Date(item.createdAt),
          paid: item.paid,
          creator: creator || undefined
        };
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error("Error getting latest criminals:", error);
      return [];
    }
  }

  private async getSignature(player: PlayerMp, recordId: number, type: ResponseType) {
    if (!mp.players.exists(player.id)) return;

    console.log("getSignature", recordId, type)
    if (!recordId || !type) return;

    switch (type) {
      case ResponseType.Mandate:
        const mandate = Array.from(this.mandates).find(m => m.id === recordId);
        return mandate?.signature;
      case ResponseType.Incident:
        const incident = Array.from(this.incidents).find(i => i.id === recordId);
        return incident?.signature;
      case ResponseType.Criminal:
        const criminal = Array.from(this.criminals).find(c => c.id === recordId);
        return criminal?.signature;
      case ResponseType.Car:
        const car = Array.from(this.cars).find(c => c.id === recordId);
        return car?.signature;
      default:
        return null;
    }
  }

  private async acceptCall(player: PlayerMp, id: number) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const dispatch = Dispatch.getByID(id);
    if (!dispatch) return;

    dispatch.answerByPlayer(player);

    return true;
  }

  private async rejectCall(player: PlayerMp, id: number) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const dispatch = Dispatch.getByID(id);
    if (!dispatch) return;

    dispatch.rejectByPlayer(player);

    return true;
  }

  private async addCarForm(player: PlayerMp, dataString: string) {
    if (!player.user || !player.user.fraction) return;
    if (!fractionID.includes(player.user.fraction)) return;

    const data: ICarForm = JSON.parse(dataString);

    try {
      const car = new FactionCar();

      car.carNumber = data.plate;
      car.elements = data.elements;
      car.images = data.proofs;
      car.signature = data.signature;
      car.creatorId = player.user.id;

      const savedCar = await car.save();

      this.cars.add(savedCar);

      return true;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  public async getPlayerUnpaidCriminals(player: PlayerMp) {
    const criminals = Array.from(this.criminals).filter((criminal) => criminal.userId == player.user.id);
    if (!criminals.length) return [];

    const array = criminals.map((criminal) => {
      return {
        id: criminal.id,
        userId: criminal.userId,
        name: player.user.entity.rp_name,
        description: criminal.description,
        proofs: criminal.proofs,
        signature: criminal.signature,
        date: new Date(criminal.createdAt),
        paid: criminal.paid
      }
    });

    return array.filter((criminal) => !criminal.paid);
  }

  public async payCriminalRecord(player: PlayerMp, id: number) {
    const criminal = Array.from(this.criminals).find((criminal) => criminal.id == id);
    if (!criminal) return;

    criminal.paid = true;
    await criminal.save();

    return true;
  }

  public async reloadCriminals(player: PlayerMp) {
    const criminals = await this.getPlayerUnpaidCriminals(player);
    if (!criminals) return;

    if (criminals.length > 5) {
      player.user.wanted_level = 5;
      player.user.isBlockedByCriminals = true;
      player.user.entity.isBlockedByCriminals = true;
    }
    else {
      player.user.wanted_level = criminals.length as 0 | 1 | 2 | 3 | 4 | 5;
    }

    if (player.user.isBlockedByCriminals && criminals.length <= 0) {
      player.user.isBlockedByCriminals = false;
      player.user.entity.isBlockedByCriminals = false;
    }

    return true;
  }


  private deletePersonData(player: PlayerMp, id: number) {
    if (!player.user) return;
    if (player.user.rank < 5) return;


    const mandate = Array.from(this.mandates).find((mandate) => mandate.id == id);

    if (mandate) {
      mandate.remove();

      this.mandates.delete(mandate);

      return true;
    }

    const criminal = Array.from(this.criminals).find((criminal) => criminal.id == id);
    if (criminal) {
      criminal.remove();

      this.criminals.delete(criminal);

      return true;
    }

    const incident = Array.from(this.incidents).find((incident) => incident.id == id);
    if (incident) {
      incident.remove();

      this.incidents.delete(incident);

      return true;
    }

    return false;
  }

  private isNumber(target: string): boolean {
    return !isNaN(Number(target));
  }

  private subscribeToEvents() {
    CustomEvent.registerCef("Mdt-GetOfficersList", this.getOfficersList.bind(this)),
      CustomEvent.registerCef("Mdt-GetInfoMain", this.getInfoMain.bind(this))
    CustomEvent.registerCef("Mdt-AddIncident", this.addIncident.bind(this))
    CustomEvent.registerCef("Mdt-AddMandate", this.addMandate.bind(this))
    CustomEvent.registerCef("Mdt-CriminalRecordAdd", this.addCriminalRecords.bind(this))
    // Добавление машины в розыск ICarForm
    CustomEvent.registerCef("Mdt-AddCar", this.addCarForm.bind(this))
    // Получение машины в розыске по номеру машины возвращаем ICar | null
    CustomEvent.registerCef("Mdt-GetCar", this.getCar.bind(this))

    // Получение гражданина ID или Имя. Возвращаем ICitizenDetails | null
    CustomEvent.registerCef("Mdt-GetCitizen", this.getCitizen.bind(this))


    // Поиск записи по нику или ID. Возвращаем ICriminal
    CustomEvent.registerCef("Mdt-CriminalRecordSearch", this.searchCriminalRecord.bind(this))

    // Поиск инцидента по нику или ID. Возвращаем Incident | null
    CustomEvent.registerCef("Mdt-GetIncident", this.getIncident.bind(this))

    // Получение всех инцидентов. Возвращаем Incident[]
    CustomEvent.registerCef("Mdt-GetAllIncidents", this.getAllIncidents.bind(this))

    CustomEvent.registerCef("Mdt-GetAllCriminals", this.getAllCriminals.bind(this))

    // оиск инцидента по нику или ID. Возвращаетм ICitizenMandate
    CustomEvent.registerCef("Mdt-GetMandate", this.getMandate.bind(this))

    // Принятие вызова ID вызова
    CustomEvent.registerCef("Mdt-AcceptCall", this.acceptCall.bind(this))

    // Отклонение вызова ID вызова
    CustomEvent.registerCef("Mdt-RejectCall", this.rejectCall.bind(this))

    // Получение подписи записи
    CustomEvent.registerCef("Mdt-GetSignature", this.getSignature.bind(this))

    // Получение всех mandates
    CustomEvent.registerCef("Mdt-GetAllMandates", this.getAllMandates.bind(this))

    CustomEvent.registerCef('Mdt-DeletePersonData', this.deletePersonData.bind(this))
  }
}

export default new MDT();