// const validateMiddleware = (schema) => (req, res, next) => {
//     const result = schema.safeParse(req.body);

//     if (!result.success) {
//         // const errors = result.error.errors[0].message;
//         // const errors = result.error.errors.map(e => e.message);
//         const errors = result.error.issues.map(e => e.message);

//         return res.status(400).json({
//             message: errors.join(" • "),
//             success: false
//         });
//     }

//     req.body = result.data;
//     next();
// };

// module.exports = validateMiddleware;



const validateMiddleware = (schema, source = "body") =>(req, res, next) => {

        const result = schema.safeParse(req[source]);

        if (!result.success) {

            const errors = result.error.issues.map(
                e => e.message
            );

            return res.status(400).json({
                message: errors.join(" • "),
                success: false
            });
        }

        req[source] = result.data;

        next();
    };

module.exports = validateMiddleware;