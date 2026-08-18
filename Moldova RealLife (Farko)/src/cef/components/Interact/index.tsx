import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less";
import "./assets/style.less";
//import './interactive.module.less';
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";

export class InteractItemsBlock extends Component<{}, {
    items: {
        text: string;
        handle: number;
        x: number;
        y: number;
    }[],
}>{
    constructor(props: any) {
        super(props);
        this.state = {
            items: []
        }

        CustomEvent.register("interact:draw", (items: {
            text: string;
            handle: number;
            x: number;
            y: number;
        }[]) => {
            this.setState({ items });
        })
    }

    render() {
        return <>
            {this.state.items.map((item) => {
                return <div className="interract-rnd-item" key={item.handle} style={{
                    left: `${item.x * 100}%`,
                    top: `${item.y * 100}%`,
                }} onClick={e => {
                    e.preventDefault();
                    CustomEvent.triggerClient("interact:click", item.handle);
                }}>{item.text}</div>
            })}
        </>
    }
}

const ItemLeft = 2;

export class Interactive extends React.Component<{}, {
    show: boolean;
    type: number;
    items: number[];
    itemsText: [string, string?][];
    selectItem: number;
    name: string,
    id?: number,
    onBack?: boolean,
    onNext?: boolean,
    autoClose: boolean,
}> {
    count: number
    Items: number
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            autoClose: true,
            onBack: true,
            onNext: false,
            name: "Player Name",
            show: CEF.test,
            type: 1,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
            itemsText: [ [LangString("components.Interact.index.3292054b76f5264e9a52f3d878ba9ab8")],[LangString("components.Interact.index.91db2048275c8a287845b1f858b4ed97")], [LangString("components.Interact.index.c8fee429fdfbb1acdd47a20221166b75")], [LangString("components.Interact.index.ed0d9a6d553f901e299aa45225abd883")], [LangString("components.Interact.index.ab347ad13bf8d90b21589fe452158cb7")], [LangString("components.Interact.index.6f5f136c1a72de8cedc46f3259a35e54")], [LangString("components.Interact.index.d3688ddb1550c04b23c53b54bad2b382")], [LangString("components.Interact.index.dc3c83f871f4e202406f6347d660365d")], [LangString("components.Interact.index.f744fff57e85279901f2127475901a53")], [LangString("components.Interact.index.a1ab97b785df9f7f788e74744dd18d3f")], [LangString("components.Interact.index.652e8c5b11a8a5c9f705c3e29091279f")], [LangString("components.Interact.index.52c75569763113bd2016119afe13e715")]],
            selectItem: 0
        }

        this.Items = this.state.items.length >= 4 ? 4 : this.state.items.length;
        this.count = this.state.items.length;

        this.ev = CustomEvent.register("interractionMenu:open", (id: number, name: string, items: [string, string?][], onBack = false, onNext = false, autoClose = true) => {
            let oldStateItms = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
            let itemsText: [string, string?][] = [];
            items.map((q, i) => {
                oldStateItms[i] = i;
                itemsText.push(q);
            })
            this.count = items.length;//this.state.items.length;
            this.setState({ show: true, id, items: oldStateItms, itemsText, onBack, name, onNext, autoClose, selectItem: Math.floor(items.length/2) })
        })

    }
    componentWillUnmount(){
        if (this.ev) this.ev.destroy();
        document.removeEventListener("keyup", this.handleKeyUp, false);    
        document.removeEventListener("wheel", this.onWheel, false );
    }
    getInteractiveData = (data: any) => {
        this.setState({ show: data.show, items: data.items, type: data.type });
    }
    selectItemClick = (id: number) => {
        if(this.state.autoClose || id === 100){
            this.setState({ show: false }, () => {
                CEF.gui.setGui(null);
                CustomEvent.triggerClient("interractionMenu:select", this.state.id, id)
            });
            return;
        }
        CustomEvent.triggerClient("interractionMenu:select", this.state.id, id)
    }
    setCurrentItem = ( value:number ) => {
        if( value > 0 ) {
            if( this.state.selectItem <  this.count-1 ) 
            this.setState({...this.state, selectItem: this.state.selectItem+1});
            return;    
        }
        else {
            if( this.state.selectItem > 0 ) 
            this.setState({...this.state, selectItem: this.state.selectItem-1});
            return;    
        }
    }
    onWheel = (e:any) => {
        this.setCurrentItem( e.deltaY > 0 ? 1 :-1 );
    }
    handleKeyUp = (e: KeyboardEvent) => {
        switch( e.keyCode ) {
            case 40: 
                return this.setCurrentItem( 1 );
            case 38: 
                return this.setCurrentItem( -1 );
            case 13: 
                return this.selectItemClick( this.state.selectItem );
            case 27:
                return this.selectItemClick( 100 );
        }
        console.log( e.keyCode );
    }   
 
    componentDidMount = () => {
        this.count = this.state.items.length;
        document.addEventListener("keyup", this.handleKeyUp, false);    
        document.addEventListener("wheel", this.onWheel, false );
        this.setState({...this.state, selectItem: Math.floor(this.state.items.length/2)});
    }
    componentDidUpdate = () => {
        this.count = this.state.items.length;
    }


    render() {
        return this.state.show ? (<>
            <div className={"interact_name"}>
                <h1>{this.state.name}</h1>
            </div>
            <div className={"interact_main"}>
                <div className={"interact_scroll"}>
                {this.state.items.map((data, id) => {
                    if( data < 0 || id <  this.state.selectItem - this.Items || id > this.state.selectItem + this.Items ) return null;
                    if(id < this.Items-this.state.selectItem ) return <div key={id} className="interact_item_free"/> 
                })}
                {this.state.items.map((data, id) => {
                    if( data < 0 || id <  this.state.selectItem - this.Items || id > this.state.selectItem + this.Items ) return null;
                    if( this.state.selectItem >= this.count-this.Items && id >= this.count-this.Items && this.state.selectItem >= id ) return <div key={id} className="interact_item_free_end"/>
                })}
                {this.state.items.map((data, id) => {
                    if( data < 0 || id <  this.state.selectItem - this.Items || id > this.state.selectItem + this.Items ) return null;
                    let left_offset = ( this.count > this.Items ? this.Items:this.count)*ItemLeft - ItemLeft* (id > this.state.selectItem ? ( id-this.state.selectItem) : ( this.state.selectItem-id) ),
                        opacity = 0.9-( id-this.state.selectItem)/(id > this.state.selectItem ? 5:-5);
                    return (
                                <div key={id} className={"interact_item"} style={{ marginLeft: `${left_offset}vw`, opacity: opacity }} onClick={() => { this.selectItemClick(id) }}>
                                        {/* <img src={icons[this.state.itemsText[data][1]] || doIcon} alt={this.state.itemsText[data][0]} ></img> */}
                                        {this.state.itemsText[data][0]}
                                </div>
                            )
                })}
                </div>
            </div>
        </>) : <></>;
    }
}
