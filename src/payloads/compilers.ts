import Joi from "joi";

export interface CompilersPayload_Cpp {
  sources: { name: string; content: string; main: boolean; }[];
  input?: string;
}

export const CompilersPayloadJoi_Cpp = {
  sources: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required(),
    main: Joi.boolean().required().default(false),
  })).min(1).required(),
  input: Joi.string().allow("").optional(),
};

export interface CompilersPayload_Java {
  sources: { name: string; content: string; main: boolean; }[];
  input?: string;
}

export const CompilersPayloadJoi_Java = {
  sources: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required(),
    main: Joi.boolean().required().default(false),
  })).min(1).required(),
  input: Joi.string().allow("").optional(),
};

export interface CompilersPayload_Node {
  sources: { name: string; content: string; main: boolean; }[];
  input?: string;
}

export const CompilersPayloadJoi_Node = {
  sources: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required(),
    main: Joi.boolean().required().default(false),
  })).min(1).required(),
  input: Joi.string().allow("").optional(),
};

export interface CompilersPayload_Python {
  sources: { name: string; content: string; main: boolean; }[];
  input?: string;
}

export const CompilersPayloadJoi_Python = {
  sources: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required(),
    main: Joi.boolean().required().default(false),
  })).min(1).required(),
  input: Joi.string().allow("").optional(),
};
