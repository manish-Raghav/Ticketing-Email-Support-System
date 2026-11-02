import ticketService from "../Service/ticketService.js";

export const receiveInboundEmail = async (req, res, next) => {
  try {
    const result = await ticketService.receiveInboundEmail(req.body);
    return res.status(result.duplicate ? 200 : 201).json({
      success: true,
      message: result.duplicate ? "Email was already processed." : "Inbound email reply saved successfully.",
      data: result,
    });
  } catch (error) { next(error); }
};
