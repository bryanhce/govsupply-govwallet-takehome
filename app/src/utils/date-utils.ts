import moment from "moment";

export const getCurrentEpoch = (): number => {
  return moment().valueOf();
};
