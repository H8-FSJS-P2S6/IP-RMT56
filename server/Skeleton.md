npx sequelize-cli model:generate --name User --attributes fullName:string,email:string,password:string

npx sequelize-cli model:generate --name Pokemon --attributes name:string,image:string,description:string,effect:string,primary_attribute:string,abilities:jsonb,height:integer,weight:integer,strength:integer,agility:integer,lore:text,min_level:integer,max_level:integer

npx sequelize-cli model:generate --name MyPokemon --attributes userId:integer,pokemon:jsonb
