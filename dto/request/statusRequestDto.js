class StatusCreateRequest {
    constructor(body) {
        this.writerKakaoId = body.writerKakaoId;
        this.message = body.message;
        this.location = body.location;
    }

    isValid() {
        return typeof this.writerKakaoId === 'string' &&
            typeof this.message === 'string' &&
            typeof this.location === 'object' &&
            typeof this.location.latitude === 'number' &&
            typeof this.location.longitude === 'number';
    }
}

module.exports = { StatusCreateRequest };