INSERT INTO dealerships(id,name,position_json,spawn_json) VALUES
(1,'Premium Deluxe Motorsport',JSON_OBJECT('x',-33.7,'y',-1102.0,'z',26.4),JSON_OBJECT('x',-14.0,'y',-1097.0,'z',26.7,'h',160.0)),
(2,'Luxury Autos',JSON_OBJECT('x',-796.3,'y',-220.7,'z',37.1),JSON_OBJECT('x',-774.5,'y',-234.5,'z',37.1,'h',205.0))
ON DUPLICATE KEY UPDATE name=VALUES(name),position_json=VALUES(position_json),spawn_json=VALUES(spawn_json);

INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 1,'blista',18000,25,'compact',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=1 AND model='blista');
INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 1,'sultan',52000,18,'sports',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=1 AND model='sultan');
INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 1,'baller2',78000,12,'suv',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=1 AND model='baller2');
INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 2,'schafter3',145000,10,'premium',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=2 AND model='schafter3');
INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 2,'comet2',220000,8,'premium',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=2 AND model='comet2');
INSERT INTO dealership_stock(dealership_id,model,price,stock,class,metadata_json)
SELECT 2,'cognoscenti',285000,6,'luxury',JSON_OBJECT() WHERE NOT EXISTS(SELECT 1 FROM dealership_stock WHERE dealership_id=2 AND model='cognoscenti');
