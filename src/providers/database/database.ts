
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) { }
//cria o banco caso nao exista
  public getDB() {
    return this.sqlite.create({
      name: 'products.db',
      location: 'default'
    });
  }
  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        this.createTables(db);
        this.insertDefaultItens(db);
      })
      .catch(e => console.error(e));
  }
  private createTables(db: SQLiteObject) {
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS categories (id integer primary key AUTOINCREMENT NOT NULL,name TEXT)'],
      ['CREATE TABLE IF NOT EXISTS products (id integer primary key AUTOINCREMENT NOT NULL,name TEXT, price REAL, duedate DATE, active integer, category_id integer, FOREIGN KEY(category_id))']
    ])
      .then(() => console.log('Tabelas criadas com sucesso!'))
      .catch(e => console.log('Erro ao criar as tabelas.', e));
  }
  private insertDefaultItens(db: SQLiteObject) {
    db.executeSql('select COUNT(id) as qtd from categories')
      .then((data: any) => {
        
        // Se não existe nenhum registro 
        if(data.rows.item(0).qtd == 0) {

      //Gravando registros na tabela
      db.sqlBatch([
        ['insert into categories (name) values (?)', ['Hambúrgeres']],
        ['insert into categories (name) values (?)', ['Bebidas']],
        ['insert into categories (name) values (?)', ['Sobremesas']]
      ])
      .then(() => console.log('Dados padrões inseridos com sucesso!'))
      .catch(e => console.log('Erro ao inserir dados padrões.', e));
      }
  })
  .catch(e => console.error('Erro ao consultar a qtd de categorias',e));

}

}
