import type { ReusableFormField } from ".";

const visaTypeOptions = ["Student", "Working", "Dependent"];
const genderOptions = ["Male", "Female", "Other"];
const locationOptions = ["Nepal", "Japan", "USA"];
const coeStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
];
const visaStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Approved",
  "Rejected",
];
const clientStatusOptions = [
  "New",
  "Document Collection",
  "Processing",
  "COE Applied",
  "COE Received",
  "Visa Applied",
  "Visa Approved",
  "Visa Rejected",
  "Departed",
  "Arrived in Japan",
];

function toSelectOptions(options: string[]) {
  return options.map((option) => ({ label: option, value: option }));
}

export const staffFormFields: ReusableFormField[] = [
  { name: "name", label: "Name", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  {
    name: "location",
    label: "Location",
    type: "select",
    required: true,
    options: toSelectOptions(locationOptions),
  },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
];

export function getClientFormFields(
  staffOptions: Array<{ label: string; value: string }>,
  canAssignStaff = true,
  includeRemarks = true,
): ReusableFormField[] {
  const fields: ReusableFormField[] = [
    { name: "clientId", label: "Client ID", required: true },
    { name: "fullName", label: "Full Name", required: true },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [{ label: "Select gender", value: "" }, ...toSelectOptions(genderOptions)],
    },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "address", label: "Address" },
    { name: "nationality", label: "Nationality" },
    { name: "passportNumber", label: "Passport Number" },
    { name: "passportExpiryDate", label: "Passport Expiry Date", type: "date" },
    {
      name: "visaType",
      label: "Visa Type",
      type: "select",
      required: true,
      options: toSelectOptions(visaTypeOptions),
    },
    { name: "statusOfResidence", label: "Status of Residence" },
    { name: "lastQualification", label: "Last Qualification" },
    { name: "japaneseLanguageLevel", label: "Japanese Language Level" },
    { name: "schoolName", label: "School Name" },
    { name: "course", label: "Course" },
    { name: "intake", label: "Intake" },
    { name: "jobCategory", label: "Job Category" },
    { name: "jobTitle", label: "Job Title" },
    { name: "companyName", label: "Company Name" },
    { name: "workLocation", label: "Work Location" },
    { name: "sponsorName", label: "Sponsor Name" },
    { name: "sponsorRelationship", label: "Sponsor Relationship" },
    { name: "sponsorStatusOfResidence", label: "Sponsor Status of Residence" },
    {
      name: "coeStatus",
      label: "COE Status",
      type: "select",
      options: toSelectOptions(coeStatusOptions),
    },
    {
      name: "visaStatus",
      label: "Visa Status",
      type: "select",
      options: toSelectOptions(visaStatusOptions),
    },
    {
      name: "clientStatus",
      label: "Client Status",
      type: "select",
      options: toSelectOptions(clientStatusOptions),
    },
    { name: "cv", label: "CV Upload", type: "file", accept: ".pdf,.doc,.docx" },
  ];

  if (canAssignStaff) {
    fields.splice(fields.length - 2, 0, {
      name: "assignedStaff",
      label: "Assign To",
      type: "select",
      options: [{ label: "Unassigned", value: "" }, ...staffOptions],
    });
  }

  if (includeRemarks) {
    fields.push({ name: "remarks", label: "Remarks", type: "textarea" });
  }

  return fields;
}

export const clientFormDefaults = {
  nationality: "Nepali",
  visaType: "Student",
  coeStatus: "Not Applied",
  visaStatus: "Not Applied",
  clientStatus: "New",
};
