import Url from 'url/Model/Url.js';

class UrlRepository {
    async getAll() {
        return Url.find();
    }

    async getById(id) {
        return Url.findById(id);
    }

    async create(data) {
        const url = new Url(data);
        return url.save();
    }

    async update(id, data) {
        return Url.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return Url.findByIdAndDelete(id);
    }
}

export default new UrlRepository();
