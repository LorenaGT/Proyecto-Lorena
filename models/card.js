const { v4: uuidv4 } = require('uuid')

const { DatabaseService } = require('../services/database')
const { AvatarService } = require('../services/avatar')

class CardRepository {

    constructor() {}

    getCards() {
      
        const database = new DatabaseService()
        return database.get('cards')  
        
    }
}


class Card {
    constructor(cardName,description, price) {
        this.id = uuidv4()
        this.name = cardName
        this.price = price
        this.description = description
        this.avatar = new AvatarService().getUniqueAvatarFromName(this.id)
    }
}



module.exports = {
    Card, CardRepository
}

