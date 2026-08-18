import { LangString, langStringDefault } from "./lang";
import {getDocumentName} from "../../shared/documents";
import {DOCUMENT_GIVE_POSITIONS} from "../../shared/documents.pos";
import {LicenseName} from "../../shared/licence";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {DialogInput, MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {getBaseItemNameById} from "../../shared/inventory";


DOCUMENT_GIVE_POSITIONS.map((item, id) => {
    colshapes.new(item.pos, item.name, player => {
        if(user.fraction !== item.fraction) return user.notify(LangString("documents.pos.e5468cc36a900eb296e666b6f311aa9a"), "error");
        if(user.rank < item.rank) return user.notify(LangString("documents.pos.89eae61f04f3b19b1c54d08a06b27f85", item.rank), "error");
        const m = new MenuClass(item.name, LangString("documents.pos.79422c8493ff0ec095cecec334603fde"));

        if(item.documents){
            item.documents.map((doc, ids) => {
                m.newItem({
                    name: getDocumentName(doc.id),
                    more: LangString("documents.pos.a7ee4f35ba691ff1cfcd08436bfd7049", system.numberFormat(doc.cost)),
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput(LangString("documents.pos.d6be1d3295aa9f64ac26a0bfe5c1ca6e"), null, 5, "int").then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer("document:pos:get", id, "doc", ids, val)
                        })
                    }
                })
            })
        }
        if(item.license){
            item.license.map((doc, ids) => {
                m.newItem({
                    name: LicenseName[doc.id],
                    more: LangString("documents.pos.11afb93e6faaa4210d7f914523b98852", system.numberFormat(doc.cost), doc.days),
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput(LangString("documents.pos.330af2c2ed8afcf7a452aa1586bdefa4"), null, 5, "int").then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer("document:pos:get", id, "lic", ids, val)
                        })
                    }
                })
            })
        }
        if(item.items){
            item.items.map((item, ids) => {
                m.newItem({
                    name: getBaseItemNameById(item.id),
                    more: LangString("documents.pos.29931287df30d109975a5fd4ca11cde8", system.numberFormat(item.cost)),
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput(LangString("documents.pos.53270292352710136fb3d13b742d2df5"), null, 5, "int").then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer("document:pos:get", id, "item", ids, val)
                        })
                    }
                })
            })
        }

        m.open();
    }, {
        radius: 1,
        type: 27,
        colshapeRadius: 1.2,
        color: [255, 182, 193, 200],
    })
})