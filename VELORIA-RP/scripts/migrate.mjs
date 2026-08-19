import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const db=await mysql.createConnection({host:process.env.MYSQL_HOST??'127.0.0.1',port:Number(process.env.MYSQL_PORT??3306),user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE,multipleStatements:true});
try{
 await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations(name VARCHAR(255) PRIMARY KEY,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
 const dir=resolve(process.cwd(),'database');
 const files=(await readdir(dir)).filter(f=>/^\d+.*\.sql$/i.test(f)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 const[done]=await db.query('SELECT name FROM schema_migrations');const applied=new Set(done.map(r=>r.name));
 for(const file of files){if(applied.has(file)){console.log('skip',file);continue}const sql=await readFile(resolve(dir,file),'utf8');console.log('apply',file);await db.beginTransaction();try{await db.query(sql);await db.query('INSERT INTO schema_migrations(name) VALUES(?)',[file]);await db.commit()}catch(e){await db.rollback();throw e}}
 console.log('VELORIA migrations OK');
}finally{await db.end()}
