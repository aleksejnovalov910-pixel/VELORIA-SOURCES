import React, {Component} from "react";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventSocket} from "../../modules/socket.io";

/** Komponente für die Echtzeit-Datenaktualisierung vom Server */
export class SocketSync extends Component<{
    /** URL, unter der wir die Komponente abonnieren */
    path: string;
    /** Ein Ereignis, das aufgerufen wird, wenn Daten aktualisiert werden und wenn sie geöffnet werden (kombiniert im Wesentlichen Öffnen und Aktualisieren) */
    data: (data:any)=>void;
}, {}> {
    private ev: { destroy: () => void };
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    get path() {
        return this.props.path
    }

    componentDidMount(){
        this.subscribe()
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    private subscribe(){
        if(this.ev) this.ev.destroy();
        this.ev = CustomEventSocket.register(`SocketSync:${this.path}`, (data:any) => {
            if(this.props.data) this.props.data(data)
        })
        CustomEvent.callServer("webcomponent:subscribe", this.path)
    }

    private unsubscribe(){
        CustomEvent.callServer("webcomponent:unsubscribe", this.path)
        if(this.ev) this.ev.destroy();
        this.ev = null;
    }


    render() {
        return this.props.children;
    }
}