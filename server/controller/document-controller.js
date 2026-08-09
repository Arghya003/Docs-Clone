import Document from "../Schema/documentSchema.js";

export const getDocument = async (id) => {
  if (!id) return;

  const document = await Document.findById(id);

  if (document) return document;

  return await Document.create({ _id: id, title: "Untitled Document", data: "" });
};

export const updateDocument = async (id, data) => {
  return await Document.findByIdAndUpdate(id, { data });
};

export const updateDocumentTitle = async (id, title) => {
  return await Document.findByIdAndUpdate(id, { title }, { new: true });
};

export const getAllDocuments = async () => {
  return await Document.find({}).sort({ updatedAt: -1 });
};

export const deleteDocument = async (id) => {
  return await Document.findByIdAndDelete(id);
};
