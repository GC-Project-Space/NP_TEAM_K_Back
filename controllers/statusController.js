const service = require('../services/statusService');
const {StatusCreateRequest} = require("../dto/request/statusRequestDto");
const {StatusResponse} = require("../dto/response/statusResponseDto");

const createStatus = async (req, res) => {
    const dto = new StatusCreateRequest(req.body);
    if (!dto.isValid()) return res.status(400).json({ error: '유효하지 않은 요청' });

    const saved = await service.createStatus(dto);
    res.status(201).json(new StatusResponse(saved));
};

const deleteStatus = async (req, res) => {
    const { id } = req.params;
    const { kakaoId } = req.query;
    const success = await service.deleteStatus(id, kakaoId);
    if (!success) return res.status(404).json({ error: '삭제 실패 또는 권한 없음' });
    res.json({ message: '삭제 완료' });
};

const getStatuses = async (req, res) => {
    const { lat, lng, sort, kakaoId } = req.query;
    const results = await service.getStatuses({ lat: +lat, lng: +lng, sort, kakaoId });
    res.json(results.map(s => new StatusResponse(s, s.myReaction)));
};

const getStatusById = async (req, res) => {
    const { id } = req.params;
    const { kakaoId } = req.query;

    const { status, myReaction } = await service.getStatusById({ id, kakaoId });
    if (!status) return res.status(404).json({ error: '상태 없음' });

    res.json(new StatusResponse(status, myReaction));
};

const addReaction = async (req, res) => {
    const { id, type } = req.params;
    const { kakaoId } = req.query;

    const updated = await service.reactToStatus({ statusId: id, kakaoId, reactionType: type });
    if (!updated) return res.status(400).json({ error: '리액션 실패' });

    res.json(new StatusResponse(updated, type));
};

const cancelReaction = async (req, res) => {
    const { id, type } = req.params;
    const { kakaoId } = req.query;

    const updated = await service.cancelReaction({ statusId: id, kakaoId, reactionType: type });
    if (!updated) return res.status(400).json({ error: '리액션 취소 실패' });

    res.json(new StatusResponse(updated, null));
};

module.exports = {
    createStatus,
    deleteStatus,
    getStatuses,
    getStatusById,
    addReaction,
    cancelReaction,
};
