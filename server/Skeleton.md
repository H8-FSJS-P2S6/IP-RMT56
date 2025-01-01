npx sequelize-cli model:generate --name User --attributes email:string,password:string

npx sequelize-cli model:generate --name Pokemon --attributes name:string,image:string,role:string,primary_attribute:string,abilities:jsonb,health:integer,mana:integer,strength:integer,agility:integer,intelligence:integer,lore:text,attack_range:integer,movement_speed:integer

npx sequelize-cli model:generate --name MyPokemon --attributes userId:integer,pokemons:jsonb
