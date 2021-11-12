const { KeyObject } = require('crypto')
const fs = require('fs')


class DatabaseService {
    DB_FILE_PATH = __dirname + '/../.db.json'
    constructor() {}

// Crea el archivo de la BD
    init() {
        return fs.writeFileSync(this.DB_FILE_PATH, '{}')
    }

    // Mira si la BD existe
    exists() {
        return fs.existsSync(this.DB_FILE_PATH)
    }
     
    storeOne(key, instance) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH))
        let newData = { ...dbData}

        if (!(key in newData)) {
            newData[key] = [instance]
        } else {
            newData[key].push(instance)
        }

        fs.writeFileSync(this.DB_FILE_PATH, JSON.stringify(newData, null, ' '))

        return newData
    }

    
    removeOne(key,instanceId) {
      const elementItem = this.get(key)  
      const itemToRemoveIndex = elementList.findIndex(
          item => item.id === instanceId)
         elementList.splice(itemToRemoveIndex, 1)

         // Guadar la nueva lista en la BD
      this.store(key, elementList)
    }

    store(key,data) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH)) 
        let newData = {...dbData}

        newData[key] = data 
        const jsonData= JSON.stringify(newData)

       
        fs.writeFileSync(this.DB_FILE_PATH, jsonData,  null, ' ')
        
        return newData
    }

    findOne(key, instancedId) {
        const elementList = this.get(key)
        return elementList.find(item => item.id === instancedId)
     }
      
     
    // Toma los datos basado en esta clave
    get(key) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH))
        return dbData[key]
    }

    
    
    
}

module.exports = {
    DatabaseService
}