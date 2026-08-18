import React, { Component } from "react";

import "./style.scss";
import { CustomEvent } from "../../modules/custom.event";
import { InteractionItem } from "../../../shared/interactions";
import { InteractMenu } from "./component";


export interface Category {
    key: string,
    img: string,
    title: string
}

export class Interaction extends Component<{}, {
    isVehicle: boolean,
    id: number,
    cats: Category[],
    elements: any,
    selectedCat: Category | null,
    allItems: InteractionItem[]
}> {
    private containerRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);

        this.containerRef = React.createRef();

        this.state = {
            id: 0,
            isVehicle: false,
            allItems: [],
            cats: [
                {
                    key: "romantic",
                    img: "heart",
                    title: "Романтичесткое 0"
                },
                {
                    key: "romantic",
                    img: "businessSharp",
                    title: "Романтичесткое 1"
                },
                {
                    key: "romantic",
                    img: "carFront",
                    title: "Романтичесткое 2"
                },
                {
                    key: "bubble",
                    img: "carHood",
                    title: "Романтичесткое 3"
                },
                {
                    key: "romantic",
                    img: "cash",
                    title: "Романтичесткое 4"
                },
                {
                    key: "romantic",
                    img: "chatbubbles",
                    title: "Романтичесткое 5"
                },
                {
                    key: "romantic",
                    img: "documentLock",
                    title: "Романтичесткое 6"
                },
                {
                    key: "romantic",
                    img: "documentText",
                    title: "Романтичесткое 7"
                },
                {
                    key: "romantic",
                    img: "evacuation",
                    title: "Романтичесткое 8"
                },
                {
                    key: "romantic",
                    img: "fileTray",
                    title: "Романтичесткое 9"
                }
            ],
            elements: {
                "romantic": [
                    {
                        key: "kiss",
                        img: "mask",
                        title: "Поцеловать"
                    }
                ]
            },
            selectedCat: null
        };

        CustomEvent.register('intMenu:open', (id: number, isVehicle: boolean, items: InteractionItem[]) => {
            const categories: { key: string, img: string, title: string }[] = [];
            const elements: any = [];
            console.log(items)
            items.map(item => {
                if (!categories.find(i => i.title === item.category)) {
                    console.log('push')
                    categories.push({ key: item.category, img: 'star', title: item.category })
                    elements[item.category] = []
                }
                //elements.push(item.category)
                elements[item.category].push({ key: item.name, img: item.icon, title: item.name })
            })
            console.log(elements)
            this.setState({
                ...this.state,
                id,
                isVehicle,
                cats: categories,
                elements,
                allItems: items
            })
        })

        // Bind methods
        this.adjustZoom = this.adjustZoom.bind(this);
    }

    componentDidMount() {
        this.adjustZoom();
        window.addEventListener("resize", this.adjustZoom);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.adjustZoom);
    }

    adjustZoom() {
        const container = this.containerRef.current;
        if (container) {
            const zoomCountOne = window.innerWidth / 1920;
            const zoomCountTwo = window.innerHeight / 1080;

            if (zoomCountOne < zoomCountTwo) {
                container.style.zoom = zoomCountOne.toString();
            } else {
                container.style.zoom = zoomCountTwo.toString();
            }
        }
    }

    start(isVehicle: boolean, cats: Category[], elements: any): void {
        this.setState({ ...this.state, isVehicle, cats, elements, selectedCat: null });
    }

    getItems(): any {
        if (this.state.selectedCat === null) {
            return this.state.cats.filter(c => c.key != '').concat(this.state.elements['']);
        } else {
            if (!this.state.elements[this.state.selectedCat.key]) return [];
            return this.state.elements[this.state.selectedCat.key];
        }
    }

    clickItem(key: string): void {
        if (this.state.selectedCat === null && this.state.allItems.find(item => item.name == key)?.category != '') {
            for (let index in this.state.cats) {
                if (this.state.cats[index].key === key)
                    return this.setState({ ...this.state, selectedCat: this.state.cats[index] });
            }
        } else {
            // Call на клиент
            CustomEvent.triggerClient('interractionMenu:select', this.state.id, this.state.allItems.findIndex(item => item.name == key))
            this.setState({ ...this.state, selectedCat: null });
        }
    }

    resetCat(): void {
        this.setState({ ...this.state, selectedCat: null });
    }
    
    render() {
        return <div className="interact-menu-container-box">
            <div className="interact-menu-box" ref={this.containerRef}>
                <InteractMenu 
                cats={this.state.cats}
                elements={this.state.elements}
                selectedCat={this.state.selectedCat}
                clickItem={this.clickItem.bind(this)}
                resetCat={this.resetCat.bind(this)}
                isVehicle={this.state.isVehicle}
                />
            </div>
        </div>
    }
}