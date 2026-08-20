INSERT INTO garages (id,name,type,owner_type,owner_id,slots,position_json,spawn_json)
VALUES
  (1,'Legion Square Parking','public',NULL,NULL,30,JSON_OBJECT('x',215.82,'y',-810.05,'z',30.73),JSON_OBJECT('x',229.33,'y',-800.12,'z',30.57,'heading',159.0)),
  (2,'Vespucci Parking','public',NULL,NULL,30,JSON_OBJECT('x',-1184.37,'y',-1510.18,'z',4.65),JSON_OBJECT('x',-1178.85,'y',-1495.39,'z',4.38,'heading',304.0)),
  (3,'Vinewood Parking','public',NULL,NULL,30,JSON_OBJECT('x',365.23,'y',295.11,'z',103.46),JSON_OBJECT('x',378.69,'y',288.67,'z',102.97,'heading',164.0)),
  (4,'Airport Parking','public',NULL,NULL,40,JSON_OBJECT('x',-1034.12,'y',-2733.04,'z',20.17),JSON_OBJECT('x',-1020.44,'y',-2733.24,'z',20.16,'heading',239.0))
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  type=VALUES(type),
  slots=VALUES(slots),
  position_json=VALUES(position_json),
  spawn_json=VALUES(spawn_json);
