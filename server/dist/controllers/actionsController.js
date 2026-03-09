import { getActions } from "db/queries/actions.js";
export const getAllActionsHandler = async (req, res, next) => {
    try {
        const actions = await getActions();
        res.status(200).json(actions);
    }
    catch (error) {
        next(error);
    }
};
