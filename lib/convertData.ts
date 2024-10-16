interface MongoDocument {
  _id: string | number;
  [key: string]: any; // Allow other properties
}

export const replaceMongoIdInArray = (
  array: MongoDocument[]
): { id: string; [key: string]: any }[] => {
  const mappedArray = array
    .map((item) => ({
      id: item._id.toString(), // Convert _id to string and rename it to id
      ...item,
    }))
    .map(({ _id, ...rest }) => rest); // Remove _id from the result

  return mappedArray;
};

export const replaceMongoIdInObject = (
  obj: MongoDocument | null
): { id: string; [key: string]: any } | null => {
  if (!obj) return null;

  const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() }; // Replace _id with id
  return updatedObj;
};
