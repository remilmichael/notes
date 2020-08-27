export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const generateHeader = (idToken) => {
    return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
    };
}