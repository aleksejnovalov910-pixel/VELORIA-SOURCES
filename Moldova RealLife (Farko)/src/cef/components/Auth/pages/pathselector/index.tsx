import React from "react";

type Props = {
	selectLine: (line: number) => void;
};

export function PathSelector({ selectLine }: Props) {
	return (
		<div className="plot-selection">
			{/* ILEGAL */}
			<div className="plot plot-1">
				<div className="plot-top">
					<div className="title">
						<h5>Povestea</h5>
						<h1>PANTA ALUNECOASA</h1>
					</div>
					<div className="text">
						<p>
							A trai cinstit dupa regulile altora nu e pentru toata lumea. De ce
							sa respecti legea cand poti face una proprie? Daca simti ca strada
							te cheama, atunci aceasta cale e pentru tine. Pornesti dintr-un
							cartier sarac, intri in lumea interlopa si urci treptat pana ajungi
							sa conduci o gasca si sa controlezi teritorii.
						</p>
					</div>
				</div>
				<div className="controls">
					<button className="button" onClick={() => selectLine(0)}>
						Selecteaza
					</button>
				</div>
			</div>

			{/* LEGAL */}
			<div className="plot plot-2">
				<div className="plot-top">
					<div className="title">
						<h5>Povestea</h5>
						<h1>VISUL AMERICAN</h1>
					</div>
					<div className="text">
						<p>
							Cresti prin munca cinstita si vrei sa reusesti prin fortele proprii?
							Aceasta este calea ta. Pornesti simplu, muncesti corect si ajungi
							sa aperi orasul de rau-facatori. Daca ramai pe drumul legal, poti
							ajunge sus in politie, guvern sau alte structuri importante.
						</p>
					</div>
				</div>
				<div className="controls">
					<button className="button" onClick={() => selectLine(1)}>
						Selecteaza
					</button>
				</div>
			</div>

			{/* BANCHER */}
			<div className="plot plot-3">
				<div className="plot-top">
					<div className="title">
						<h5>Povestea</h5>
						<h1>NU POTI INTERZICE VIATA BUNA</h1>
					</div>
					<div className="text">
						<p>
							Ai avut totul – bani, masini, distractii. Dar ai pierdut totul.
							Daca vrei sa recastigi luxul si viata pe care o aveai, acum e momentul.
							Pornesti iar de jos, dar cu experienta si ambitie poti urca din nou.
							Fiecare pas conteaza si te duce spre masini scumpe, relatii si stilul
							de viata care ti-a lipsit.
						</p>
						<p className="attention">
							<span className="title">Atentie!</span>
							<span className="content">
								Aceasta poveste este recomandata doar jucatorilor experimentati. Nu vei avea misiuni de tip storyline.
							</span>
						</p>
					</div>
				</div>
				<div className="controls">
					<button className="button" onClick={() => selectLine(2)}>
						Selecteaza
					</button>
				</div>
			</div>
		</div>
	);
}
