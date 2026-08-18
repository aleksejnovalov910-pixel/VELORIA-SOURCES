import React from 'react';
import { LangString } from '../../../../client/modules/lang';
import { CustomEvent } from "../../../modules/custom.event";

type Props = {
    stats: {
        [key: string]: string[]
    },
    farmData: {
        [key: string]: number | { current: number; max: number }
    }
}
export const Side = ({ stats, farmData }: Props) => {
    // Get all the keys except "amount" which we'll handle separately
    const otherKeys = Object.keys(stats).filter(key => key !== 'amount');

    // Extract the amount value from farmData
    const amountValue = farmData.amount;
    const [amountName, amountPrefix] = stats.amount;

    return (
        <div className="content-menu">
            <h1>
                {LangString(
                    "components.Mining.index.60b9a310bfa17938e015e9456f53051e",
                )}
            </h1>
            <div className="earned">
                <h2>
                    {LangString(
                        "components.Mining.index.8cbdb4249975d5477c066e2d9c8337b9"
                    )}
                </h2>
                <h3>
                    <span>
                        {typeof amountValue !== "object" ?
                            amountValue || 0 :
                            (amountValue.current || 0)
                        }
                    </span> {amountPrefix}
                </h3>
            </div>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    CustomEvent.triggerServer("mining:sell");
                }}
            >
                {LangString(
                    "components.Mining.index.3a7a0291d43b84e6b0e2a15b09cffe53"
                )}
            </button>
            <div className="details">
                {otherKeys.map((key) => {
                    const [name, prefix] = stats[key];
                    const val = farmData[key];

                    return (
                        <div key={`mining_stat_${key}`} className="detail earned">
                            <h1>{name}</h1>
                            <h2>
                                {typeof val !== "object" ? (
                                    <>{val || 0}{prefix}</>
                                ) : (
                                    <>{val.current || 0}{prefix} / {val.max || 0}{prefix}</>
                                )}
                            </h2>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}



// <div className="stats">
// {Object.keys(stats).map((key, i) => {
//     let [name, prefix]: [string, string] = (stats as any)[
//         key
//     ];
//     let val: number | { current: number; max: number } = (
//         this.farmData as any
//     )[key];
//     return (
//         <div
//             className="stats-item"
//             key={`mining_stat_${key}`}
//         >
//             <div className="stats-name">{name}</div>
//             <div className="stats-value-wrapper">
//                 <div className="stats-value title-m">
//                     {typeof val != "object" ? (
//                         <>
//                             {val || 0}
//                             {prefix}
//                         </>
//                     ) : (
//                         <>
//                             {val.current || 0}
//                             {prefix} / {val.max || 0}
//                             {prefix}
//                         </>
//                     )}
//                 </div>
//                 {/*<div className="stats-increase-value title-m">+80{prefix}</div>*/}
//             </div>
//             {i === 0 ? (
//                 <button
//                     className="btn purple"
//                     onClick={(e) => {
//                         e.preventDefault();
//                         CustomEvent.triggerServer("mining:sell");
//                     }}
//                 >
//                     {LangString(
//                         "components.Mining.index.3a7a0291d43b84e6b0e2a15b09cffe53",
//                     )}
//                 </button>
//             ) : (
//                 <></>
//             )}
//         </div>
//     );
// })}
// </div>