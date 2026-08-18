import React, { useEffect } from "react";
import checkmark from "../img/rewardcollected.svg";
import { MAX_DAYS, DAILY_REWARDS } from "../../../../shared/dailyRewards";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("../img/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, (value as { default: string }).default];
    }
  )
);

interface IRewards {
  currentDay: number;
  lastRewardDate: number;
  todayPlayTime: number;
  resetDate: number;
  requiredPlayTime: number;
  isRewardClaimed: boolean;
  claimedRewards: number[];
  allTimeClaimedRewards: number[];
  canClaimReward: boolean;
}

type Props = {
  rewards: IRewards;
  onClaimReward: (id: number) => void;
};

export default function MenuRewards({ rewards, onClaimReward }: Props) {
  // useEffect(() => {
  //   if (rewards) {
  //     console.log('Rewards component mounted with data:', {
  //       currentDay: rewards.currentDay,
  //       playTime: rewards.todayPlayTime,
  //       requiredTime: rewards.requiredPlayTime,
  //       canClaim: rewards.canClaimReward
  //     });
  //   }
  //   return () => {
  //     console.log('Rewards component unmounted');
  //   };
  // }, [rewards]);

  const {
    currentDay = 1,
    lastRewardDate = 0,
    todayPlayTime = 0,
    resetDate = 0,
    requiredPlayTime = 0,
    isRewardClaimed = false,
    claimedRewards = [],
    allTimeClaimedRewards = [],
    canClaimReward = false,
  } = rewards || {};

  if (!rewards) {
    return (
      <div className="umenu-rewards">
        <div className="umenu-title">Daily Rewards</div>
        <div className="umenu-subtitle">Loading rewards...</div>
      </div>
    );
  }

  const getItems = () => {
    const items = [];
    for (let i = 1; i <= MAX_DAYS; i++) {
      const isClaimed = claimedRewards?.includes(i);
      const isCollectedEver = allTimeClaimedRewards?.includes(i);
      items.push({
        isClaimed: isClaimed,
        isCollectedEver: isCollectedEver,
        id: i,
        canCollect: !claimedRewards?.includes(i) && i <= currentDay && (i < currentDay || (i == currentDay && !rewards?.isRewardClaimed && rewards?.canClaimReward)),
      });
    }

    return items;
  };

  const convertTime = () => {
    const time = Math.max(0, requiredPlayTime - todayPlayTime);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);

    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  return (
    <>
      <div className="umenu-rewards">
        <div className="umenu-title">Daily Rewards</div>
        <div className="umenu-subtitle">Ai nevoie de 3 ore jucate în fiecare zi pentru a putea colecta recompensele! Pentru fiecare zi pierduta vei pierde sansa de a ajunge la ultimele recompense!</div>
        <div className="umenu-info">
          <div className="umenu-box">TIMP: {convertTime()}</div>
          <div className="umenu-box">DAY {currentDay}</div>
        </div>
        <div className="umenu-list">
          {getItems().map((i) => {
            const isCollected = i?.isClaimed;
            const isCollectedEver = i?.isCollectedEver;
            return (
              <div
                className={
                  "umenu-item " +
                  (isCollected ? "umenu-reward-item-collected" : "") +
                  (!isCollected && isCollectedEver ? " umenu-reward-item-collected-ever" : "")
                }
              >
                {isCollected ? (
                  <div className="umenu-checkmark umenu-reward-checkmark-collected">
                    <img src={checkmark} alt="" />
                  </div>
                ) : isCollectedEver ? (
                  <div className="umenu-checkmark umenu-reward-checkmark-collected-ever">
                    <img src={checkmark} alt="" />
                  </div>
                ) : (
                  <div className="umenu-checkmark"></div>
                )}
                <div className="umenu-day">Day {i?.id}</div>

                <img src={png[DAILY_REWARDS[i.id]?.image || "reward"]} alt="" />

                <div className="umenu-text">{DAILY_REWARDS[i.id]?.title}</div>
                {isCollected ? (
                  <button className="umenu-reward-btn-collected">
                    Colectat
                  </button>
                ) : isCollectedEver ? (
                  <button className="umenu-reward-btn-collected-ever" disabled>
                    Colectat deja
                  </button>
                ) : (
                  <button 
                    onClick={() => i?.canCollect && onClaimReward(i?.id)}
                    disabled={!i?.canCollect}
                    className={!i?.canCollect ? "umenu-reward-btn-unavailable" : ""}
                  >
                    {i?.canCollect ? "Colecteaza" : "Indisponibil"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {canClaimReward && !isRewardClaimed && !claimedRewards.includes(currentDay) && (
          <div className="umenu-reward">
            <div className="umenu-rbox">
              <div className="umenu-day">Day {currentDay}</div>
              <img src={png[DAILY_REWARDS[currentDay]?.image || "reward"]} alt="" />
              <div className="umenu-text">
                {DAILY_REWARDS[currentDay]?.title}
              </div>
              <button 
                onClick={() => rewards?.canClaimReward && onClaimReward(currentDay)}
                disabled={!rewards?.canClaimReward}
                className={!rewards?.canClaimReward ? "umenu-reward-btn-unavailable" : ""}
              >
                {rewards?.canClaimReward ? "Colecteaza" : "Indisponibil"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
