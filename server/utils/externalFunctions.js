import axios from 'axios';

const verifyCompanyNumber = async (companyNumber) => {
  const filters = encodeURIComponent(JSON.stringify({ "מספר חברה": companyNumber }));
  const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=f004176c-b85f-4542-8901-7b3176f9a054&filters=${filters}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.success || data.result.records.length === 0) {
      return null;
    }

    const record = data.result.records[0];
    return {
      number: record["מספר חברה"],
      name: record["שם חברה"],
      status: record["סטטוס חברה"],
    };
  } catch (error) {
    console.error("שגיאה באימות מספר חברה:", error);
    return null;
  }
};


export {verifyCompanyNumber};