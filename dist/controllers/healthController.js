export const healthHandler = async (req, res, next) => {
    try {
        res.status(200).send({ message: "OK" });
    }
    catch (error) {
        next(error);
    }
};
