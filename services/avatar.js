class AvatarService {
    getUniqueAvatarFromName(name) {
        const nameURI = encodeURI(name) + this.getTimestamp()
        return this.getAvatarFromName(nameURI)

    }

    getAvatarFromName(name) {
        return `https://avatars.dicebear.com/api/human/${name}.svg`

    }

    getTimestamp() {
        return Math.floor(Date.now() / 1000)
    }

    
}

module.exports = {
     AvatarService
}