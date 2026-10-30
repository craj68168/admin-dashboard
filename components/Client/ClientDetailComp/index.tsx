"use client";

import { useState, type ReactNode } from "react";
import { createTranslator, useLocale } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";

import Breadcrumb from "@/components/Breadcrumb";

import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  GENDER,
  NATIONALITIES,
  JAPANESE_LEVELS,
  PREFECTURE_OPTIONS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/components/constant";

import { useClientDetailHook } from "./hook";
import { getPortalPaths } from "@/lib/portal-routes";
import { useAuthStore } from "@/store/auth-store";

import Remarks from "./Remarks";
import Progress from "./Progress";
import Payments from "./Payments";

const messages = {
  "en": {
    "breadcrumbs": {
      "dashboard": "Dashboard",
      "clients": "Clients"
    },
    "clientIdLabel": "Client ID:",
    "back": "Back",
    "sections": {
      "basic": "Basic Information",
      "personal": "Personal information",
      "passport": "Passport & Residence",
      "education": "Education",
      "employment": "Employment history",
      "sponsor": "Sponsor",
      "visa": "Visa Information",
      "documents": "Documents",
      "recruitment": "Recruitment information",
      "address": "Address",
      "immigration": "Immigration & passport",
      "japaneseQualifications": "Japanese language & qualifications",
      "skillsCareer": "Skills & career summary",
      "applicationContent": "Japanese application content"
    },
    "fields": {
      "clientId": "Client ID",
      "fullName": "Full Name",
      "phone": "Phone",
      "visaType": "Visa Type",
      "clientStatus": "Client Status",
      "coeStatus": "COE Status",
      "assignedStaff": "Assigned Staff",
      "createdAt": "Created At",
      "lastUpdated": "Last Updated",
      "dateOfBirth": "Date of Birth",
      "gender": "Gender",
      "email": "Email",
      "nationality": "Nationality",
      "address": "Address",
      "passportNumber": "Passport Number",
      "passportExpiryDate": "Passport Expiry Date",
      "statusOfResidence": "Status of Residence",
      "lastQualification": "Last Qualification",
      "japaneseLanguageLevel": "Japanese Language Level",
      "schoolName": "School Name",
      "course": "Course",
      "intake": "Intake",
      "jobCategory": "Job Category",
      "jobTitle": "Job Title",
      "companyName": "Company Name",
      "workLocation": "Work Location",
      "sponsorName": "Sponsor Name",
      "sponsorRelationship": "Sponsor Relationship",
      "sponsorStatusOfResidence": "Sponsor Status of Residence",
      "visaStatus": "Visa Status",
      "clientImage": "Client Image",
      "cv": "CV",
      "preferredCategory": "Preferred category",
      "currentStage": "Current stage",
      "currentStageAmount": "Current stage amount",
      "updatedAt": "Updated at",
      "furigana": "Furigana",
      "postalCode": "Postal code",
      "prefecture": "Prefecture",
      "currentVisaStatus": "Current visa status",
      "residenceExpiryDate": "Residence expiry date",
      "schoolType": "School type",
      "majorCourse": "Major / course",
      "enrollmentDate": "Enrollment date",
      "graduationDate": "Graduation date",
      "graduationStatus": "Graduation status",
      "qualificationCertificate": "Qualification / certificate",
      "levelScore": "Level / score",
      "issuer": "Issuer",
      "acquiredDate": "Acquired date",
      "expiryDate": "Expiry date",
      "note": "Note",
      "employmentType": "Employment type",
      "department": "Department",
      "startDate": "Start date",
      "endDate": "End date",
      "responsibilities": "Responsibilities / main duties",
      "achievements": "Achievements",
      "skills": "Skills",
      "careerSummary": "Career summary",
      "motivation": "Motivation",
      "selfPr": "Self PR",
      "desiredConditions": "Desired conditions"
    },
    "documents": {
      "uploaded": "Uploaded",
      "notUploaded": "Not uploaded",
      "photo": "Photo",
      "originalCv": "Original CV"
    },
    "visaTypes": {
      "Student": "Student",
      "Working": "Working",
      "Dependent": "Dependent"
    },
    "coeStatuses": {
      "Not Applied": "Not Applied",
      "Applied": "Applied",
      "Processing": "Processing",
      "Received": "Received",
      "Rejected": "Rejected"
    },
    "clientStatuses": {
      "New": "New",
      "Document Collection": "Document Collection",
      "Processing": "Processing",
      "COE Applied": "COE Applied",
      "COE Received": "COE Received",
      "Visa Applied": "Visa Applied",
      "Visa Approved": "Visa Approved",
      "Visa Rejected": "Visa Rejected",
      "Departed": "Departed",
      "Arrived in Japan": "Arrived in Japan"
    },
    "messages": {
      "notFound": "Client not found.",
      "loadFailed": "Failed to load client.",
      "cvFailed": "Failed to generate Japanese CV."
    },
    "header": {
      "title": "Client profile"
    },
    "actions": {
      "back": "Back",
      "generating": "Generating...",
      "japaneseCv": "Japanese CV",
      "editClient": "Edit client"
    },
    "descriptions": {
      "recruitment": "Internal client management information. These fields are not automatically included in the employer CV.",
      "personal": "Candidate information used for Japanese resume generation.",
      "immigration": "Current visa status is the primary residence-status field used for the Japanese CV.",
      "education": "Education history used in the Japanese resume.",
      "employment": "Detailed employment history used in the Japanese work history document.",
      "applicationContent": "Content used in the generated Japanese application documents."
    },
    "photo": {
      "unavailable": "Photo unavailable",
      "notUploaded": "No photo uploaded",
      "viewPhoto": "View candidate photo",
      "alt": "Candidate photo",
      "view": "View",
      "close": "Close photo"
    },
    "empty": {
      "education": "No education history added.",
      "qualifications": "No qualifications added.",
      "employment": "No employment history added."
    },
    "itemTitles": {
      "education": "Education {number}",
      "qualification": "Qualification {number}",
      "employment": "Employment {number}"
    },
    "employment": {
      "currentlyEmployed": "Currently employed"
    },
    "viewCv": "View CV",
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "cVTypeMustBeCombinedRirekishoOrCareer": "CV type must be combined, rirekisho or career.",
      "cannotAssignAClientToAnInactiveStaffMember": "Cannot assign a client to an inactive staff member.",
      "changeTheClientStageFromTheProgressSectionSoStageHistoryAndPaymentRulesArePreserved": "Change the client stage from the Progress section so stage history and payment rules are preserved.",
      "clientIDIsRequired": "Client ID is required.",
      "clientAssignedSuccessfully": "Client assigned successfully.",
      "clientNotFound": "Client not found.",
      "clientProfileNotFound": "Client profile not found.",
      "clientUpdatedSuccessfully": "Client updated successfully.",
      "clientProfileAndStageHistoryDeletedSuccessfully": "Client, profile and stage history deleted successfully.",
      "duplicateClientProfileOrPaymentDataExists": "Duplicate client, profile or payment data exists.",
      "duplicateDataExists": "Duplicate data exists.",
      "exportFormatMustBeCsvPdfOrXlsx": "Export format must be csv, pdf or xlsx.",
      "failedToAssignClient": "Failed to assign client.",
      "failedToDeleteClient": "Failed to delete client.",
      "failedToExportClients": "Failed to export clients.",
      "failedToGenerateJapaneseCV": "Failed to generate Japanese CV.",
      "failedToGetClient": "Failed to get client.",
      "failedToGetClients": "Failed to get clients.",
      "failedToRegisterClient": "Failed to register client.",
      "failedToUpdateClient": "Failed to update client.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "paymentDateIsInvalid": "Payment date is invalid.",
      "paymentDateIsRequired": "Payment date is required.",
      "paymentMethodMustBeBankTransferOrCash": "Payment method must be Bank Transfer or Cash.",
      "pleaseSelectAStaffMember": "Please select a staff member.",
      "registrationPaymentConfirmedAndClientRegisteredSuccessfully": "Registration payment confirmed and client registered successfully.",
      "registrationStageRegisteredPaidDoesNotExistOrIsInactive": "Registration stage \"registeredPaid\" does not exist or is inactive.",
      "serverError": "Server error",
      "staffIDWasNotFoundForTheLoggedInUser": "Staff ID was not found for the logged-in user.",
      "staffCannotReassignClients": "Staff cannot reassign clients.",
      "theRegisteredPaidStageMustHaveAnAmountGreaterThan0": "The \"Registered / Paid\" stage must have an amount greater than ¥0.",
      "theSelectedStaffMemberIsInactive": "The selected staff member is inactive.",
      "thisClientHasPaymentRecordsAndCannotBePermanentlyDeletedUseArchiveWhenArchiveSupportIsAdded": "This client has payment records and cannot be permanently deleted. Use archive when archive support is added.",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisClient": "You are not authorized to access this client.",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToEditThisClient": "You are not authorized to edit this client.",
      "youAreNotAuthorizedToGenerateThisClientSCV": "You are not authorized to generate this client's CV.",
      "yourAccountHasBeenDisabled": "Your account has been disabled",
      "assignedStaffCannotBeEmpty": "assignedStaff cannot be empty.",
      "fullNamePhoneAndCurrentVisaStatusAreRequired": "fullName, phone and currentVisaStatus are required.",
      "staffIdIsRequired": "staffId is required.",
      "somethingWentWrong": "Something went wrong",
      "networkError": "Network Error",
      "failedToFetch": "Failed to fetch",
      "requestAborted": "Request aborted",
      "canceled": "canceled",
      "fieldEducation": "Education",
      "fieldEmploymentHistory": "Employment history",
      "fieldQualifications": "Qualifications",
      "fieldSkills": "Skills",
      "validationError": "Please check the submitted information."
    },
    "requestFailed": "Request failed with status code {status}.",
    "requestTimeout": "The request timed out. Please try again.",
    "stages": {
      "registeredPaid": "Registered / Paid",
      "vacancySearching": "Vacancy Searching",
      "interviewFixedPreparation": "Interview Fixed / Preparation",
      "interviewFailed": "Interview Failed",
      "jobOfferReceived": "Naitei / Job Offer Received",
      "jobOfferAccepted": "Job Offer Accepted",
      "jobOfferNotAccepted": "Job Offer Not Accepted",
      "visaDocumentsSubmitted": "Visa Documents Submitted",
      "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
      "visaApproved": "Visa Approved",
      "visaRejected": "Visa Rejected",
      "companyJoining": "Waiting for Nyusha / Company Joining",
      "employmentStartedCompanyJoined": "Employment Started / Company Joined",
      "visaRenewal1Year": "Visa Renewal - 1 Year",
      "visaRenewal3Years": "Visa Renewal - 3 Years",
      "visaRenewal5Years": "Visa Renewal - 5 Years",
      "returnToNepal": "Return to Nepal",
      "new": "New",
      "documentCollection": "Document Collection",
      "processing": "Processing",
      "cOEApplied": "COE Applied",
      "cOEReceived": "COE Received",
      "visaApplied": "Visa Applied",
      "departed": "Departed",
      "arrivedInJapan": "Arrived in Japan",
      "registrationPending": "Registration Pending",
      "registeredVacancySearching": "Registered / Vacancy Searching",
      "legacyPayment": "Legacy Payment"
    },
    "createClient": {
      "options": {
        "gender": {
          "male": "Male",
          "female": "Female",
          "other": "Other"
        },
        "currentVisaStatus": {
          "student": "Student",
          "dependent": "Dependent",
          "designatedActivitiesJobHunting": "Designated Activities - Job Hunting",
          "designatedActivities": "Designated Activities - Other",
          "engineerHumanitiesInternationalServices": "Engineer / Humanities / International Services",
          "specifiedSkilledWorker1": "Specified Skilled Worker 1",
          "specifiedSkilledWorker2": "Specified Skilled Worker 2",
          "skilledLabor": "Skilled Labor",
          "technicalInternTraining": "Technical Intern Training",
          "intraCompanyTransferee": "Intra-company Transferee",
          "nursingCare": "Nursing Care",
          "highlySkilledProfessional": "Highly Skilled Professional",
          "businessManager": "Business Manager",
          "permanentResident": "Permanent Resident",
          "spouseChildOfJapaneseNational": "Spouse / Child of Japanese National",
          "spouseChildOfPermanentResident": "Spouse / Child of Permanent Resident",
          "longTermResident": "Long-Term Resident",
          "other": "Other"
        },
        "preferCategory": {
          "newJob": "Shushoku / New Job",
          "jobChange": "Tenshoku / Job Change",
          "dependentVisaRenewal": "Dependent Visa Renewal",
          "visaServiceOnlyRenewal": "Visa Service Only / Renewal",
          "visaServiceOnlyChange": "Visa Service Only / Change",
          "otherVisaService": "Other Visa Service"
        },
        "currentStage": {
          "registeredPaid": "Registered / Paid",
          "vacancySearching": "Vacancy Searching",
          "interviewFixedPreparation": "Interview Fixed / Preparation",
          "interviewFailed": "Interview Failed",
          "jobOfferReceived": "Naitei / Job Offer Received",
          "jobOfferAccepted": "Job Offer Accepted",
          "jobOfferNotAccepted": "Job Offer Not Accepted",
          "visaDocumentsSubmitted": "Visa Documents Submitted",
          "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
          "visaApproved": "Visa Approved",
          "visaRejected": "Visa Rejected",
          "companyJoining": "Waiting for Nyusha / Company Joining",
          "employmentStartedCompanyJoined": "Employment Started / Company Joined",
          "visaRenewal1Year": "Visa Renewal - 1 Year",
          "visaRenewal3Years": "Visa Renewal - 3 Years",
          "visaRenewal5Years": "Visa Renewal - 5 Years",
          "returnToNepal": "Return to Nepal"
        },
        "nationality": {
          "nepali": "Nepali",
          "indian": "Indian",
          "pakistani": "Pakistani",
          "bangladeshi": "Bangladeshi",
          "sriLankan": "Sri Lankan",
          "vietnamese": "Vietnamese",
          "myanmar": "Myanmar",
          "indonesian": "Indonesian",
          "filipino": "Filipino",
          "chinese": "Chinese",
          "other": "Other"
        },
        "statusOfResidence": {
          "student": "Student",
          "dependent": "Dependent",
          "engineerSpecialistInHumanitiesInternationalServices": "Engineer / Specialist in Humanities / International Services",
          "specifiedSkilledWorkerNo1": "Specified Skilled Worker No. 1",
          "specifiedSkilledWorkerNo2": "Specified Skilled Worker No. 2",
          "technicalInternTraining": "Technical Intern Training",
          "designatedActivities": "Designated Activities",
          "highlySkilledProfessional": "Highly Skilled Professional",
          "skilledLabor": "Skilled Labor",
          "intraCompanyTransferee": "Intra-company Transferee",
          "nursingCare": "Nursing Care",
          "businessManager": "Business Manager",
          "instructor": "Instructor",
          "researcher": "Researcher",
          "professor": "Professor",
          "medicalServices": "Medical Services",
          "permanentResident": "Permanent Resident",
          "longTermResident": "Long-Term Resident",
          "spouseOrChildOfJapaneseNational": "Spouse or Child of Japanese National",
          "spouseOrChildOfPermanentResident": "Spouse or Child of Permanent Resident",
          "culturalActivities": "Cultural Activities",
          "trainee": "Trainee",
          "other": "Other"
        },
        "japaneseLanguageLevel": {
          "n1": "N1",
          "n2": "N2",
          "n3": "N3",
          "n4": "N4",
          "n5": "N5",
          "none": "No JLPT / None"
        },
        "educationType": {
          "japaneseLanguageSchool": "Japanese Language School",
          "vocationalSchool": "Vocational School",
          "university": "University",
          "juniorCollege": "Junior College",
          "highSchool": "High School",
          "technicalCollege": "Technical College",
          "internationalSchool": "International School",
          "other": "Other"
        },
        "employmentType": {
          "partTime": "Part-time",
          "fullTime": "Full-time / Regular Employee",
          "contract": "Contract Employee",
          "temporaryDispatchEmployee": "Temporary / Dispatch Employee",
          "other": "Other"
        },
        "prefecture": {
          "hokkaido": "Hokkaido",
          "aomori": "Aomori",
          "iwate": "Iwate",
          "miyagi": "Miyagi",
          "akita": "Akita",
          "yamagata": "Yamagata",
          "fukushima": "Fukushima",
          "ibaraki": "Ibaraki",
          "tochigi": "Tochigi",
          "gunma": "Gunma",
          "saitama": "Saitama",
          "chiba": "Chiba",
          "tokyo": "Tokyo",
          "kanagawa": "Kanagawa",
          "niigata": "Niigata",
          "toyama": "Toyama",
          "ishikawa": "Ishikawa",
          "fukui": "Fukui",
          "yamanashi": "Yamanashi",
          "nagano": "Nagano",
          "gifu": "Gifu",
          "shizuoka": "Shizuoka",
          "aichi": "Aichi",
          "mie": "Mie",
          "shiga": "Shiga",
          "kyoto": "Kyoto",
          "osaka": "Osaka",
          "hyogo": "Hyogo",
          "nara": "Nara",
          "wakayama": "Wakayama",
          "tottori": "Tottori",
          "shimane": "Shimane",
          "okayama": "Okayama",
          "hiroshima": "Hiroshima",
          "yamaguchi": "Yamaguchi",
          "tokushima": "Tokushima",
          "kagawa": "Kagawa",
          "ehime": "Ehime",
          "kochi": "Kochi",
          "fukuoka": "Fukuoka",
          "saga": "Saga",
          "nagasaki": "Nagasaki",
          "kumamoto": "Kumamoto",
          "oita": "Oita",
          "miyazaki": "Miyazaki",
          "kagoshima": "Kagoshima",
          "okinawa": "Okinawa"
        }
      },
      "graduationStatus": {
        "graduated": "Graduated",
        "expectedGraduation": "Expected graduation",
        "currentlyEnrolled": "Currently enrolled",
        "withdrawn": "Withdrawn"
      }
    }
  },
  "ja": {
    "breadcrumbs": {
      "dashboard": "ダッシュボード",
      "clients": "顧客"
    },
    "clientIdLabel": "顧客ID:",
    "back": "戻る",
    "sections": {
      "basic": "基本情報",
      "personal": "個人情報",
      "passport": "パスポート・在留情報",
      "education": "学歴",
      "employment": "職歴",
      "sponsor": "スポンサー",
      "visa": "ビザ情報",
      "documents": "書類",
      "recruitment": "採用管理情報",
      "address": "住所",
      "immigration": "在留・パスポート",
      "japaneseQualifications": "日本語・資格",
      "skillsCareer": "スキル・職務要約",
      "applicationContent": "日本語応募書類内容"
    },
    "fields": {
      "clientId": "顧客ID",
      "fullName": "氏名",
      "phone": "電話番号",
      "visaType": "ビザ種別",
      "clientStatus": "顧客ステータス",
      "coeStatus": "COEステータス",
      "assignedStaff": "担当スタッフ",
      "createdAt": "作成日",
      "lastUpdated": "最終更新日",
      "dateOfBirth": "生年月日",
      "gender": "性別",
      "email": "メール",
      "nationality": "国籍",
      "address": "住所",
      "passportNumber": "パスポート番号",
      "passportExpiryDate": "パスポート有効期限",
      "statusOfResidence": "在留資格",
      "lastQualification": "最終学歴",
      "japaneseLanguageLevel": "日本語レベル",
      "schoolName": "学校名",
      "course": "コース",
      "intake": "入学時期",
      "jobCategory": "職種カテゴリ",
      "jobTitle": "職種名",
      "companyName": "会社名",
      "workLocation": "勤務地",
      "sponsorName": "スポンサー名",
      "sponsorRelationship": "スポンサーとの関係",
      "sponsorStatusOfResidence": "スポンサーの在留資格",
      "visaStatus": "ビザステータス",
      "clientImage": "顧客画像",
      "cv": "履歴書",
      "preferredCategory": "希望カテゴリ",
      "currentStage": "現在のステージ",
      "currentStageAmount": "現在のステージ金額",
      "updatedAt": "更新日",
      "furigana": "フリガナ",
      "postalCode": "郵便番号",
      "prefecture": "都道府県",
      "currentVisaStatus": "現在の在留資格",
      "residenceExpiryDate": "在留期限",
      "schoolType": "学校種別",
      "majorCourse": "専攻・コース",
      "enrollmentDate": "入学日",
      "graduationDate": "卒業日",
      "graduationStatus": "卒業状況",
      "qualificationCertificate": "資格・証明書",
      "levelScore": "レベル・スコア",
      "issuer": "発行機関",
      "acquiredDate": "取得日",
      "expiryDate": "有効期限",
      "note": "備考",
      "employmentType": "雇用形態",
      "department": "部署",
      "startDate": "開始日",
      "endDate": "終了日",
      "responsibilities": "担当業務・主な職務",
      "achievements": "実績",
      "skills": "スキル",
      "careerSummary": "職務要約",
      "motivation": "志望動機",
      "selfPr": "自己PR",
      "desiredConditions": "本人希望記入欄"
    },
    "documents": {
      "uploaded": "アップロード済み",
      "notUploaded": "未アップロード",
      "photo": "写真",
      "originalCv": "原本CV"
    },
    "visaTypes": {
      "Student": "留学",
      "Working": "就労",
      "Dependent": "家族滞在"
    },
    "coeStatuses": {
      "Not Applied": "未申請",
      "Applied": "申請済み",
      "Processing": "処理中",
      "Received": "受領済み",
      "Rejected": "却下"
    },
    "clientStatuses": {
      "New": "新規",
      "Document Collection": "書類収集中",
      "Processing": "処理中",
      "COE Applied": "COE申請済み",
      "COE Received": "COE受領済み",
      "Visa Applied": "ビザ申請済み",
      "Visa Approved": "ビザ承認",
      "Visa Rejected": "ビザ却下",
      "Departed": "出国済み",
      "Arrived in Japan": "日本到着"
    },
    "messages": {
      "notFound": "顧客が見つかりませんでした。",
      "loadFailed": "顧客を読み込めませんでした。",
      "cvFailed": "日本語の履歴書を生成できませんでした。"
    },
    "header": {
      "title": "顧客プロフィール"
    },
    "actions": {
      "back": "戻る",
      "generating": "生成中...",
      "japaneseCv": "日本語CV",
      "editClient": "顧客を編集"
    },
    "descriptions": {
      "recruitment": "社内の顧客管理情報です。これらの項目は雇用主向けCVには自動的に含まれません。",
      "personal": "日本語履歴書の作成に使用する候補者情報です。",
      "immigration": "現在の在留資格は日本語CVで使用される主要な在留資格項目です。",
      "education": "履歴書で使用する学歴情報です。",
      "employment": "職務経歴書で使用する詳細な職歴情報です。",
      "applicationContent": "生成される日本語応募書類で使用する内容です。"
    },
    "photo": {
      "unavailable": "写真を表示できません",
      "notUploaded": "写真未アップロード",
      "viewPhoto": "候補者写真を表示",
      "alt": "候補者写真",
      "view": "表示",
      "close": "写真を閉じる"
    },
    "empty": {
      "education": "学歴はまだ追加されていません。",
      "qualifications": "資格はまだ追加されていません。",
      "employment": "職歴はまだ追加されていません。"
    },
    "itemTitles": {
      "education": "学歴 {number}",
      "qualification": "資格 {number}",
      "employment": "職歴 {number}"
    },
    "employment": {
      "currentlyEmployed": "在職中"
    },
    "viewCv": "履歴書を表示",
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "cVTypeMustBeCombinedRirekishoOrCareer": "履歴書の種類はcombined、rirekisho、careerのいずれかを指定してください。",
      "cannotAssignAClientToAnInactiveStaffMember": "無効なスタッフに顧客を割り当てることはできません。",
      "changeTheClientStageFromTheProgressSectionSoStageHistoryAndPaymentRulesArePreserved": "ステージ履歴と入金ルールを維持するため、「進捗」から顧客のステージを変更してください。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientAssignedSuccessfully": "顧客を割り当てました。",
      "clientNotFound": "顧客が見つかりません。",
      "clientProfileNotFound": "顧客のプロフィールが見つかりません。",
      "clientUpdatedSuccessfully": "顧客情報を更新しました。",
      "clientProfileAndStageHistoryDeletedSuccessfully": "顧客、プロフィール、ステージ履歴を削除しました。",
      "duplicateClientProfileOrPaymentDataExists": "顧客、プロフィール、または入金データが重複しています。",
      "duplicateDataExists": "データが重複しています。",
      "exportFormatMustBeCsvPdfOrXlsx": "出力形式はCSV、PDF、XLSXのいずれかを指定してください。",
      "failedToAssignClient": "顧客を割り当てられませんでした。",
      "failedToDeleteClient": "顧客を削除できませんでした。",
      "failedToExportClients": "顧客データを出力できませんでした。",
      "failedToGenerateJapaneseCV": "日本語の履歴書を作成できませんでした。",
      "failedToGetClient": "顧客情報を取得できませんでした。",
      "failedToGetClients": "顧客一覧を取得できませんでした。",
      "failedToRegisterClient": "顧客を登録できませんでした。",
      "failedToUpdateClient": "顧客情報を更新できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "paymentDateIsInvalid": "入金日が正しくありません。",
      "paymentDateIsRequired": "入金日を入力してください。",
      "paymentMethodMustBeBankTransferOrCash": "支払方法は銀行振込または現金を選択してください。",
      "pleaseSelectAStaffMember": "スタッフを選択してください。",
      "registrationPaymentConfirmedAndClientRegisteredSuccessfully": "登録料の入金を確認し、顧客を登録しました。",
      "registrationStageRegisteredPaidDoesNotExistOrIsInactive": "登録ステージ「registeredPaid」が存在しないか、無効になっています。",
      "serverError": "サーバーエラーが発生しました。",
      "staffIDWasNotFoundForTheLoggedInUser": "ログイン中のユーザーのスタッフIDが見つかりません。",
      "staffCannotReassignClients": "スタッフは顧客の担当者を変更できません。",
      "theRegisteredPaidStageMustHaveAnAmountGreaterThan0": "「Registered / Paid」ステージの金額は0円より大きくしてください。",
      "theSelectedStaffMemberIsInactive": "選択したスタッフは無効になっています。",
      "thisClientHasPaymentRecordsAndCannotBePermanentlyDeletedUseArchiveWhenArchiveSupportIsAdded": "この顧客には入金記録があるため、完全に削除できません。アーカイブ機能の追加後にアーカイブしてください。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisClient": "この顧客にアクセスする権限がありません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToEditThisClient": "この顧客を編集する権限がありません。",
      "youAreNotAuthorizedToGenerateThisClientSCV": "この顧客の履歴書を作成する権限がありません。",
      "yourAccountHasBeenDisabled": "アカウントは無効になっています。",
      "assignedStaffCannotBeEmpty": "担当スタッフを指定してください。",
      "fullNamePhoneAndCurrentVisaStatusAreRequired": "氏名、電話番号、在留資格を入力してください。",
      "staffIdIsRequired": "スタッフIDを指定してください。",
      "somethingWentWrong": "エラーが発生しました。もう一度お試しください。",
      "networkError": "ネットワークに接続できません。接続を確認してください。",
      "failedToFetch": "データを取得できませんでした。接続を確認してください。",
      "requestAborted": "リクエストが中断されました。",
      "canceled": "リクエストがキャンセルされました。",
      "fieldEducation": "学歴",
      "fieldEmploymentHistory": "職歴",
      "fieldQualifications": "資格",
      "fieldSkills": "スキル",
      "validationError": "送信した情報に誤りがあります。入力内容を確認してください。"
    },
    "requestFailed": "リクエストに失敗しました（ステータスコード：{status}）。",
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。",
    "stages": {
      "registeredPaid": "登録済み / 支払済み",
      "vacancySearching": "求人検索中",
      "interviewFixedPreparation": "面接確定 / 準備中",
      "interviewFailed": "面接不合格",
      "jobOfferReceived": "内定 / オファー受領",
      "jobOfferAccepted": "内定承諾",
      "jobOfferNotAccepted": "内定未承諾",
      "visaDocumentsSubmitted": "ビザ書類提出済み",
      "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
      "visaApproved": "ビザ承認",
      "visaRejected": "ビザ却下",
      "companyJoining": "入社待ち",
      "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
      "visaRenewal1Year": "ビザ更新 - 1年",
      "visaRenewal3Years": "ビザ更新 - 3年",
      "visaRenewal5Years": "ビザ更新 - 5年",
      "returnToNepal": "ネパールへ帰国",
      "new": "新規",
      "documentCollection": "書類収集中",
      "processing": "処理中",
      "cOEApplied": "COE申請済み",
      "cOEReceived": "COE受領済み",
      "visaApplied": "ビザ申請済み",
      "departed": "出国済み",
      "arrivedInJapan": "日本到着",
      "registrationPending": "登録待ち",
      "registeredVacancySearching": "登録済み / 求人検索中",
      "legacyPayment": "過去の入金"
    },
    "createClient": {
      "options": {
        "gender": {
          "male": "男性",
          "female": "女性",
          "other": "その他"
        },
        "currentVisaStatus": {
          "student": "留学",
          "dependent": "家族滞在",
          "designatedActivitiesJobHunting": "特定活動・就職活動",
          "designatedActivities": "特定活動・その他",
          "engineerHumanitiesInternationalServices": "技術・人文知識・国際業務",
          "specifiedSkilledWorker1": "特定技能1号",
          "specifiedSkilledWorker2": "特定技能2号",
          "skilledLabor": "技能",
          "technicalInternTraining": "技能実習",
          "intraCompanyTransferee": "企業内転勤",
          "nursingCare": "介護",
          "highlySkilledProfessional": "高度専門職",
          "businessManager": "経営・管理",
          "permanentResident": "永住者",
          "spouseChildOfJapaneseNational": "日本人の配偶者等",
          "spouseChildOfPermanentResident": "永住者の配偶者等",
          "longTermResident": "定住者",
          "other": "その他"
        },
        "preferCategory": {
          "newJob": "就職 / 新規就職",
          "jobChange": "転職",
          "dependentVisaRenewal": "家族滞在ビザ更新",
          "visaServiceOnlyRenewal": "ビザ手続きのみ / 更新",
          "visaServiceOnlyChange": "ビザ手続きのみ / 変更",
          "otherVisaService": "その他のビザ手続き"
        },
        "currentStage": {
          "registeredPaid": "登録済み / 支払済み",
          "vacancySearching": "求人検索中",
          "interviewFixedPreparation": "面接確定 / 準備中",
          "interviewFailed": "面接不合格",
          "jobOfferReceived": "内定 / オファー受領",
          "jobOfferAccepted": "内定承諾",
          "jobOfferNotAccepted": "内定未承諾",
          "visaDocumentsSubmitted": "ビザ書類提出済み",
          "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
          "visaApproved": "ビザ承認",
          "visaRejected": "ビザ却下",
          "companyJoining": "入社待ち",
          "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
          "visaRenewal1Year": "ビザ更新 - 1年",
          "visaRenewal3Years": "ビザ更新 - 3年",
          "visaRenewal5Years": "ビザ更新 - 5年",
          "returnToNepal": "ネパールへ帰国"
        },
        "nationality": {
          "nepali": "ネパール",
          "indian": "インド",
          "pakistani": "パキスタン",
          "bangladeshi": "バングラデシュ",
          "sriLankan": "スリランカ",
          "vietnamese": "ベトナム",
          "myanmar": "ミャンマー",
          "indonesian": "インドネシア",
          "filipino": "フィリピン",
          "chinese": "中国",
          "other": "その他"
        },
        "statusOfResidence": {
          "student": "留学",
          "dependent": "家族滞在",
          "engineerSpecialistInHumanitiesInternationalServices": "技術・人文知識・国際業務",
          "specifiedSkilledWorkerNo1": "特定技能1号",
          "specifiedSkilledWorkerNo2": "特定技能2号",
          "technicalInternTraining": "技能実習",
          "designatedActivities": "特定活動",
          "highlySkilledProfessional": "高度専門職",
          "skilledLabor": "技能",
          "intraCompanyTransferee": "企業内転勤",
          "nursingCare": "介護",
          "businessManager": "経営・管理",
          "instructor": "教育",
          "researcher": "研究",
          "professor": "教授",
          "medicalServices": "医療",
          "permanentResident": "永住者",
          "longTermResident": "定住者",
          "spouseOrChildOfJapaneseNational": "日本人の配偶者等",
          "spouseOrChildOfPermanentResident": "永住者の配偶者等",
          "culturalActivities": "文化活動",
          "trainee": "研修",
          "other": "その他"
        },
        "japaneseLanguageLevel": {
          "n1": "N1",
          "n2": "N2",
          "n3": "N3",
          "n4": "N4",
          "n5": "N5",
          "none": "JLPTなし / 未取得"
        },
        "educationType": {
          "japaneseLanguageSchool": "日本語学校",
          "vocationalSchool": "専門学校",
          "university": "大学",
          "juniorCollege": "短期大学",
          "highSchool": "高等学校",
          "technicalCollege": "高等専門学校",
          "internationalSchool": "インターナショナルスクール",
          "other": "その他"
        },
        "employmentType": {
          "partTime": "アルバイト",
          "fullTime": "正社員",
          "contract": "契約社員",
          "temporaryDispatchEmployee": "派遣社員",
          "other": "その他"
        },
        "prefecture": {
          "hokkaido": "北海道",
          "aomori": "青森県",
          "iwate": "岩手県",
          "miyagi": "宮城県",
          "akita": "秋田県",
          "yamagata": "山形県",
          "fukushima": "福島県",
          "ibaraki": "茨城県",
          "tochigi": "栃木県",
          "gunma": "群馬県",
          "saitama": "埼玉県",
          "chiba": "千葉県",
          "tokyo": "東京都",
          "kanagawa": "神奈川県",
          "niigata": "新潟県",
          "toyama": "富山県",
          "ishikawa": "石川県",
          "fukui": "福井県",
          "yamanashi": "山梨県",
          "nagano": "長野県",
          "gifu": "岐阜県",
          "shizuoka": "静岡県",
          "aichi": "愛知県",
          "mie": "三重県",
          "shiga": "滋賀県",
          "kyoto": "京都府",
          "osaka": "大阪府",
          "hyogo": "兵庫県",
          "nara": "奈良県",
          "wakayama": "和歌山県",
          "tottori": "鳥取県",
          "shimane": "島根県",
          "okayama": "岡山県",
          "hiroshima": "広島県",
          "yamaguchi": "山口県",
          "tokushima": "徳島県",
          "kagawa": "香川県",
          "ehime": "愛媛県",
          "kochi": "高知県",
          "fukuoka": "福岡県",
          "saga": "佐賀県",
          "nagasaki": "長崎県",
          "kumamoto": "熊本県",
          "oita": "大分県",
          "miyazaki": "宮崎県",
          "kagoshima": "鹿児島県",
          "okinawa": "沖縄県"
        }
      },
      "graduationStatus": {
        "graduated": "卒業",
        "expectedGraduation": "卒業見込み",
        "currentlyEnrolled": "在学中",
        "withdrawn": "中退"
      }
    }
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"]});
}

const normalizeMessage = (value: string) => value.trim().replace(/\.+$/, "").toLowerCase();
const serverMessageKeys = new Map(
  Object.entries(messages.en.serverMessages).map(([key, value]) => [normalizeMessage(value), key]),
);

// Resolve stored message keys and known API messages when rendering so locale changes
// also update messages already on screen.
function translateServerMessage(
  message: string | null | undefined,
  locale: string,
  t: ReturnType<typeof useLocalTranslations>,
  fallback: keyof typeof messages.en.messages,
) {
  if (typeof message !== "string" || !message.trim()) return t(("messages." + fallback) as never);
  if (message.startsWith("messages.") && t.has(message as never)) return t(message as never);
  const key = serverMessageKeys.get(normalizeMessage(message));
  if (key) return t(("serverMessages." + key) as never);
  const httpError = /^Request failed with status code (\d+)\.?$/i.exec(message.trim());
  if (httpError) return t("requestFailed", {status: httpError[1]});
  if (/^timeout of \d+ms exceeded/i.test(message)) return t("requestTimeout");

  if (locale !== "ja" || /^[\u3040-\u30ff\u3400-\u9fff]/u.test(message)) return message;
  if (/validation failed|cast to .+ failed/i.test(message)) return t("serverMessages.validationError");
  if (/E11000|duplicate key/i.test(message)) return t("serverMessages.duplicateDataExists");
  return t(("messages." + fallback) as never);
}

const stageMessageKeys: Readonly<Record<string, keyof typeof messages.en.stages>> = {
  "legacy payment": "legacyPayment",
  "registered/paid": "registeredPaid",
  "registeredpaid": "registeredPaid",
  "vacancy searching": "vacancySearching",
  "vacancysearching": "vacancySearching",
  "interview fixed/preparation": "interviewFixedPreparation",
  "interviewfixedpreparation": "interviewFixedPreparation",
  "interview failed": "interviewFailed",
  "interviewfailed": "interviewFailed",
  "naitei/job offer received": "jobOfferReceived",
  "jobofferreceived": "jobOfferReceived",
  "job offer accepted": "jobOfferAccepted",
  "jobofferaccepted": "jobOfferAccepted",
  "job offer rejected": "jobOfferNotAccepted",
  "joboffernotaccepted": "jobOfferNotAccepted",
  "visa documents submitted": "visaDocumentsSubmitted",
  "visadocumentssubmitted": "visaDocumentsSubmitted",
  "visa applied/result waiting": "visaAppliedResultWaiting",
  "visaappliedresultwaiting": "visaAppliedResultWaiting",
  "visa approved": "visaApproved",
  "visaapproved": "visaApproved",
  "visa rejected": "visaRejected",
  "visarejected": "visaRejected",
  "waiting for nyusha/company joining": "companyJoining",
  "companyjoining": "companyJoining",
  "employment started/company joined": "employmentStartedCompanyJoined",
  "employmentstartedcompanyjoined": "employmentStartedCompanyJoined",
  "visa renewal - 1 year": "visaRenewal1Year",
  "visarenewal1year": "visaRenewal1Year",
  "visa renewal - 3 years": "visaRenewal3Years",
  "visarenewal3years": "visaRenewal3Years",
  "visa renewal - 5 years": "visaRenewal5Years",
  "visarenewal5years": "visaRenewal5Years",
  "return to nepal": "returnToNepal",
  "returntonepal": "returnToNepal",
  "job offer not accepted": "jobOfferNotAccepted",
  "new": "new",
  "document collection": "documentCollection",
  "processing": "processing",
  "coe applied": "cOEApplied",
  "coe received": "cOEReceived",
  "visa applied": "visaApplied",
  "departed": "departed",
  "arrived in japan": "arrivedInJapan",
  "registration pending": "registrationPending",
  "registered/vacancy searching": "registeredVacancySearching"
};
function translateStage(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return "-";
  const key = stageMessageKeys[value.trim().toLowerCase().replace(/\s*\/\s*/g, "/")];
  return key ? t(("stages." + key) as never) : value;
}


// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5546";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const PAGE_BG = "#F4F6F5";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const MUTED = "#6B7280";
const DANGER = "#B91C1C";
const DANGER_SOFT = "#FEF2F2";

// Japanese resume photos are 3:4 (30 x 40 mm), so the portrait keeps that ratio.
const PHOTO_RATIO = "3 / 4";

const cardSx = {
  bgcolor: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
};

// =================================================
// HELPERS
// =================================================

const displayValue = (value?: string | null) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "-";
  }

  return String(value);
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatCurrency = (value?: number) => {
  return `¥${Number(value || 0).toLocaleString()}`;
};

const getUploadedFileUrl = (filePath?: string | null) => {
  if (!filePath) {
    return "";
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

  const backendUrl = apiUrl.replace(/\/api\/?$/, "");

  const normalizedPath = filePath.replace(/\\/g, "/");

  return `${backendUrl}/${normalizedPath.replace(/^\/+/, "")}`;
};

const getInitials = (name?: string) => {
  if (!name) {
    return "";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// =================================================
// LAYOUT PRIMITIVES
// =================================================

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Box
    component="section"
    sx={{
      ...cardSx,
      p: { xs: 2, sm: 3, md: 3.5 },
    }}
  >
    <Box
      sx={{
        pb: 2,
        mb: 2.5,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: INK,
          fontSize: { xs: 16, md: 17 },
          fontWeight: 700,
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            mt: 0.5,
            color: MUTED,
            fontSize: 12.5,
            lineHeight: 1.55,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>

    {children}
  </Box>
);

const Field = ({ label, value }: { label: string; value?: ReactNode }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      sx={{
        color: MUTED,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      {label}
    </Typography>

    <Typography
      component="div"
      sx={{
        mt: 0.5,
        color: INK,
        fontSize: 14.5,
        fontWeight: 500,
        lineHeight: 1.6,
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      {value ?? "-"}
    </Typography>
  </Box>
);

// Fields wrap on their own, so no per-breakpoint tuning is needed.
const FieldGrid = ({
  children,
  min = 200,
}: {
  children: ReactNode;
  min?: number;
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`,
      columnGap: { xs: 2, md: 3 },
      rowGap: { xs: 2, md: 2.75 },
    }}
  >
    {children}
  </Box>
);

const ItemCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box
    sx={{
      position: "relative",
      p: { xs: 1.75, sm: 2.25 },
      pl: { xs: 2.25, sm: 2.75 },
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        bgcolor: BRAND,
        opacity: 0.75,
      },
    }}
  >
    <Typography
      sx={{
        mb: 2,
        color: INK,
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {title}
    </Typography>

    {children}
  </Box>
);

const EmptyNote = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      py: 2.5,
      px: 2,
      border: `1px dashed ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
      color: MUTED,
      fontSize: 13.5,
      textAlign: "center",
    }}
  >
    {children}
  </Box>
);

const StatusBadge = ({ children }: { children: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 26,
      px: 1.25,
      borderRadius: 999,
      bgcolor: BRAND_SOFT,
      color: BRAND,
      fontSize: 12,
      fontWeight: 700,
      lineHeight: 1.2,
    }}
  >
    {children}
  </Box>
);

const DocumentBadge = ({
  uploaded,
  uploadedLabel,
  notUploadedLabel,
}: {
  uploaded: boolean;
  uploadedLabel: string;
  notUploadedLabel: string;
}) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      minHeight: 26,
      px: 1.25,
      borderRadius: 999,
      bgcolor: uploaded ? BRAND_SOFT : DANGER_SOFT,
      color: uploaded ? BRAND : DANGER,
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    <Box
      component="span"
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "currentColor",
      }}
    />

    {uploaded ? uploadedLabel : notUploadedLabel}
  </Box>
);

// =================================================
// CANDIDATE PHOTO
// =================================================

const CandidatePhoto = ({
  src,
  name,
  failed,
  onFail,
  onOpen,
  photoUnavailableLabel,
  noPhotoUploadedLabel,
  viewPhotoLabel,
  photoAltLabel,
  viewLabel,
}: {
  src: string;
  name?: string;
  failed: boolean;
  onFail: () => void;
  onOpen: () => void;
  photoUnavailableLabel: string;
  noPhotoUploadedLabel: string;
  viewPhotoLabel: string;
  photoAltLabel: string;
  viewLabel: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const hasPhoto = Boolean(src) && !failed;
  const initials = getInitials(name);

  const frameSx = {
    position: "relative",
    width: "100%",
    aspectRatio: PHOTO_RATIO,
    borderRadius: 2.5,
    overflow: "hidden",
    border: `1px solid ${HAIRLINE}`,
    boxShadow: "0 8px 24px -14px rgba(17,24,39,0.35)",
    bgcolor: "#EEF3F1",
  } as const;

  // No photo, or the file failed to load
  if (!hasPhoto) {
    return (
      <Box
        sx={{
          ...frameSx,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          background: `linear-gradient(160deg, ${BRAND_SOFT}, rgba(16,122,100,0.16))`,
          color: BRAND,
        }}
      >
        {initials ? (
          <Typography
            sx={{
              fontSize: { xs: 26, lg: 42 },
              fontWeight: 700,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {initials}
          </Typography>
        ) : (
          <PersonOutlineRoundedIcon sx={{ fontSize: { xs: 34, lg: 52 } }} />
        )}

        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: 12,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          {src ? photoUnavailableLabel : noPhotoUploadedLabel}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={onOpen}
      aria-label={viewPhotoLabel}
      sx={{
        ...frameSx,
        p: 0,
        display: "block",
        cursor: "zoom-in",
        font: "inherit",
        "& .photo-overlay": {
          opacity: 0,
          transition: "opacity 160ms ease",
        },
        "&:hover .photo-overlay, &:focus-visible .photo-overlay": {
          opacity: 1,
        },
        "&:focus-visible": {
          outline: `3px solid ${BRAND}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={name || photoAltLabel}
        onLoad={() => setLoaded(true)}
        onError={onFail}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 240ms ease",
        }}
      />

      {!loaded && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress size={22} sx={{ color: BRAND }} />
        </Box>
      )}

      <Box
        className="photo-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pb: 1.25,
          background:
            "linear-gradient(to top, rgba(10,30,25,0.55), rgba(10,30,25,0) 45%)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <ZoomInRoundedIcon sx={{ fontSize: 16 }} />
          {viewLabel}
        </Box>
      </Box>
    </Box>
  );
};

// =================================================
// CONTACT ROW (profile card)
// =================================================

const ContactRow = ({
  icon,
  value,
}: {
  icon: ReactNode;
  value?: string | null;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      minWidth: 0,
      color: MUTED,
      "& svg": { fontSize: 17, flexShrink: 0 },
    }}
  >
    {icon}
    <Typography
      sx={{
        color: INK,
        fontSize: 13.5,
        fontWeight: 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={value || undefined}
    >
      {displayValue(value)}
    </Typography>
  </Box>
);

// =================================================
// CLIENT DETAIL
// =================================================

const ClientDetail = () => {
  const locale = useLocale();
  const t = useLocalTranslations();
  const createT = createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"].createClient});


  const {
    clientId,
    client,

    isLoading,
    isError,
    errorMessage,

    isGeneratingCv,
    cvError,

    handleBack,
    handleEdit,
    handleGenerateJapaneseCv,
  } = useClientDetailHook();
  const role = useAuthStore((state) => state.user?.role);
  const paths = getPortalPaths(role);

  // Hooks must run before any early return
  const [photoOpen, setPhotoOpen] = useState(false);
  const [failedPhotoUrl, setFailedPhotoUrl] = useState("");

  const candidatePhotoUrl = getUploadedFileUrl(client?.profile?.clientImage);
  const photoFailed = failedPhotoUrl === candidatePhotoUrl;
  const hasPhoto = Boolean(candidatePhotoUrl) && !photoFailed;

  // =================================================
  // OPTION LABELS
  // =================================================

  const getCurrentVisaStatusLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = CURRENT_VISA_STATUS_OPTIONS.find(
      (item) => item.value === value,
    );

    if (!option) {
      return value;
    }

    return createT(`options.currentVisaStatus.${option.key}` as never);
  };

  const getPreferCategoryLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = PREFER_CATEGORY_OPTIONS.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.preferCategory.${option.key}` as never);
  };

  const getGenderLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = GENDER.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.gender.${option.key}` as never);
  };

  const getNationalityLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = NATIONALITIES.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.nationality.${option.key}` as never);
  };

  const getPrefectureLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = PREFECTURE_OPTIONS.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.prefecture.${option.key}` as never);
  };

  const getJapaneseLevelLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = JAPANESE_LEVELS.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.japaneseLanguageLevel.${option.key}` as never);
  };

  const getEducationTypeLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = EDUCATION_TYPE_OPTIONS.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.educationType.${option.key}` as never);
  };

  const getEmploymentTypeLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const option = EMPLOYMENT_TYPE_OPTIONS.find((item) => item.value === value);

    if (!option) {
      return value;
    }

    return createT(`options.employmentType.${option.key}` as never);
  };

  const getGraduationStatusLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const labels: Record<string, string> = {
      graduated: createT("graduationStatus.graduated"),
      expectedGraduation: createT("graduationStatus.expectedGraduation"),
      currentlyEnrolled: createT("graduationStatus.currentlyEnrolled"),
      withdrawn: createT("graduationStatus.withdrawn"),
    };

    return labels[value] || value;
  };

  // =================================================
  // LOADING
  // =================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: PAGE_BG,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress size={30} sx={{ color: BRAND }} />
      </Box>
    );
  }

  // =================================================
  // ERROR
  // =================================================

  if (isError || !client) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: PAGE_BG,
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Alert severity="error" sx={{ borderRadius: 2.5 }}>
            {errorMessage ? translateServerMessage(errorMessage, locale, t, "loadFailed") : t("messages.notFound")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const profile = client.profile;

  const originalCvUrl =
  getUploadedFileUrl(profile?.cv);

  const education = profile?.education ?? [];
  const qualifications = profile?.qualifications ?? [];
  const employmentHistory = profile?.employmentHistory ?? [];
  const skills = profile?.skills ?? [];

  const currentStageName =
    client.currentStageDetails?.name ||
    client.clientStatus ||
    client.currentStage;

  const currentStageAmount = client.currentStageDetails?.amount ?? 0;

  const assignedStaffName = client.assignedStaffDetails?.name
    ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
    : client.assignedStaff;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAGE_BG,
        px: { xs: 1.5, sm: 3, md: 4 },
        pb: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1360, mx: "auto" }}>
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box sx={{ mb: 2 }}>
          <Breadcrumb
            items={[
              {
                label: t("breadcrumbs.dashboard"),
                href: paths.dashboard,
              },
              {
                label: t("breadcrumbs.clients"),
                href: paths.clients,
              },
              {
                label: client.fullName,
                current: true,
              },
            ]}
          />
        </Box>

        {/* =================================================
        HEADER + ACTIONS
        ================================================= */}

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: INK,
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("header.title")}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, auto)",
              },
              gap: 1,
              "& > button": {
                minHeight: 42,
                textTransform: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
              },
              // Edit is the primary action, keep it on its own row on phones
              "& > button:last-of-type": {
                gridColumn: { xs: "1 / -1", sm: "auto" },
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleBack}
              sx={{
                borderColor: HAIRLINE,
                color: MUTED,
                bgcolor: SURFACE,
                "&:hover": { borderColor: MUTED, bgcolor: SURFACE },
              }}
            >
              {t("actions.back")}
            </Button>

            <Button
              variant="outlined"
              startIcon={
                isGeneratingCv ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PictureAsPdfOutlinedIcon />
                )
              }
              disabled={isGeneratingCv}
              onClick={handleGenerateJapaneseCv}
              sx={{
                borderColor: DANGER,
                color: DANGER,
                bgcolor: SURFACE,
                "&:hover": {
                  borderColor: "#991B1B",
                  bgcolor: DANGER_SOFT,
                },
              }}
            >
              {isGeneratingCv
                ? t("actions.generating")
                : t("actions.japaneseCv")}
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                bgcolor: BRAND,
                "&:hover": { bgcolor: BRAND_HOVER },
              }}
            >
              {t("actions.editClient")}
            </Button>
          </Box>
        </Box>

        {cvError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
            {translateServerMessage(cvError, locale, t, "cvFailed")}
          </Alert>
        )}

        {/* =================================================
        BODY: PROFILE SIDEBAR + CONTENT
        ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "300px minmax(0, 1fr)",
            },
            gap: { xs: 2, md: 3 },
            alignItems: "start",
          }}
        >
          {/* -------------------------------------------------
          PROFILE CARD
          ------------------------------------------------- */}

          <Box
            component="aside"
            sx={{
              ...cardSx,
              p: { xs: 2, sm: 2.5 },
              display: "flex",
              flexDirection: { xs: "row", lg: "column" },
              alignItems: { xs: "flex-start", lg: "stretch" },
              flexWrap: { xs: "wrap", lg: "nowrap" },
              gap: { xs: 2, lg: 2.5 },
              position: { lg: "sticky" },
              top: { lg: 16 },
            }}
          >
            {/* Photo */}
            <Box
              sx={{
                width: { xs: 108, sm: 140, lg: "100%" },
                flexShrink: 0,
                // keep the portrait from becoming huge in the sidebar
                maxWidth: { lg: 240 },
                mx: { lg: "auto" },
              }}
            >
              <CandidatePhoto
                src={candidatePhotoUrl}
                name={client.fullName}
                failed={photoFailed}
                onFail={() => setFailedPhotoUrl(candidatePhotoUrl)}
                onOpen={() => setPhotoOpen(true)}
                photoUnavailableLabel={t("photo.unavailable")}
                noPhotoUploadedLabel={t("photo.notUploaded")}
                viewPhotoLabel={t("photo.viewPhoto")}
                photoAltLabel={t("photo.alt")}
                viewLabel={t("photo.view")}
              />
            </Box>

            {/* Identity */}
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 0, lg: "auto" },
                flexBasis: { xs: 0, lg: "auto" },
                // On very narrow screens the name block drops below the photo
                "@media (max-width:399px)": { flexBasis: "100%" },
                textAlign: { xs: "left", lg: "center" },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  color: INK,
                  fontSize: { xs: 19, sm: 22 },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  wordBreak: "break-word",
                }}
              >
                {client.fullName}
              </Typography>

              {profile?.furigana && (
                <Typography sx={{ mt: 0.25, color: MUTED, fontSize: 13 }}>
                  {profile.furigana}
                </Typography>
              )}

              <Typography sx={{ mt: 1, color: MUTED, fontSize: 12.5 }}>
                {t("fields.clientId")}{" "}
                <Box component="span" sx={{ color: BRAND, fontWeight: 700 }}>
                  {clientId}
                </Box>
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  justifyContent: { xs: "flex-start", lg: "center" },
                }}
              >
                <StatusBadge>{translateStage(currentStageName, t)}</StatusBadge>
              </Box>
            </Box>

            {/* Contact + documents */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                pt: 2,
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <ContactRow icon={<PhoneOutlinedIcon />} value={client.phone} />
              <ContactRow icon={<EmailOutlinedIcon />} value={profile?.email} />

              <Divider sx={{ my: 0.5, borderColor: HAIRLINE }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: MUTED, fontSize: 12.5 }}>
                  {t("documents.photo")}
                </Typography>
                <DocumentBadge
                  uploaded={hasPhoto}
                  uploadedLabel={t("documents.uploaded")}
                  notUploadedLabel={t("documents.notUploaded")}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: MUTED,
                    fontSize: 12.5,
                  }}
                >
                  {t("documents.originalCv")}
                </Typography>

                {originalCvUrl ? (
                  <Button
                    component="a"
                    href={originalCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    sx={{
                      textTransform: "none",
                      color: BRAND,
                      fontWeight: 600,
                      minWidth: "auto",
                    }}
                  >
                    {t("viewCv")}
                  </Button>
                ) : (
                  <DocumentBadge
                    uploaded={false}
                    uploadedLabel={t("documents.uploaded")}
                    notUploadedLabel={t("documents.notUploaded")}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* -------------------------------------------------
          MAIN CONTENT
          ------------------------------------------------- */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
              minWidth: 0,
            }}
          >
            {/* RECRUITMENT */}
            <Section
              title={t("sections.recruitment")}
              description={t("descriptions.recruitment")}
            >
              <FieldGrid>
                <Field label={t("fields.clientId")} value={client.clientId} />

                <Field
                  label={t("fields.preferredCategory")}
                  value={getPreferCategoryLabel(client.preferCategory)}
                />

                <Field
                  label={t("fields.assignedStaff")}
                  value={assignedStaffName}
                />

                <Field
                  label={t("fields.currentStage")}
                  value={<StatusBadge>{translateStage(currentStageName, t)}</StatusBadge>}
                />

                <Field
                  label={t("fields.currentStageAmount")}
                  value={formatCurrency(currentStageAmount)}
                />

                <Field
                  label={t("fields.intake")}
                  value={displayValue(profile?.intake)}
                />

                <Field
                  label={t("fields.createdAt")}
                  value={formatDate(client.createdAt, locale)}
                />

                <Field
                  label={t("fields.updatedAt")}
                  value={formatDate(client.updatedAt, locale)}
                />
              </FieldGrid>
            </Section>

            {/* PERSONAL */}
            <Section
              title={t("sections.personal")}
              description={t("descriptions.personal")}
            >
              <FieldGrid>
                <Field label={t("fields.fullName")} value={client.fullName} />

                <Field
                  label={t("fields.furigana")}
                  value={displayValue(profile?.furigana)}
                />

                <Field label={t("fields.phone")} value={client.phone} />

                <Field
                  label={t("fields.email")}
                  value={displayValue(profile?.email)}
                />

                <Field
                  label={t("fields.dateOfBirth")}
                  value={formatDate(profile?.dateOfBirth, locale)}
                />

                <Field
                  label={t("fields.gender")}
                  value={getGenderLabel(profile?.gender)}
                />

                <Field
                  label={t("fields.nationality")}
                  value={getNationalityLabel(profile?.nationality)}
                />
              </FieldGrid>
            </Section>

            {/* ADDRESS */}
            <Section title={t("sections.address")}>
              <FieldGrid>
                <Field
                  label={t("fields.postalCode")}
                  value={displayValue(profile?.postalCode)}
                />

                <Field
                  label={t("fields.prefecture")}
                  value={getPrefectureLabel(profile?.prefecture)}
                />

                <Field
                  label={t("fields.address")}
                  value={displayValue(profile?.address)}
                />
              </FieldGrid>
            </Section>

            {/* IMMIGRATION */}
            <Section
              title={t("sections.immigration")}
              description={t("descriptions.immigration")}
            >
              <FieldGrid>
                <Field
                  label={t("fields.currentVisaStatus")}
                  value={getCurrentVisaStatusLabel(client.currentVisaStatus)}
                />

                <Field
                  label={t("fields.residenceExpiryDate")}
                  value={formatDate(profile?.residenceExpiryDate, locale)}
                />

                <Field
                  label={t("fields.passportNumber")}
                  value={displayValue(profile?.passportNumber)}
                />

                <Field
                  label={t("fields.passportExpiryDate")}
                  value={formatDate(profile?.passportExpiryDate, locale)}
                />
              </FieldGrid>
            </Section>

            {/* EDUCATION */}
            <Section
              title={t("sections.education")}
              description={t("descriptions.education")}
            >
              {education.length === 0 ? (
                <EmptyNote>{t("empty.education")}</EmptyNote>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {education.map((item, index) => (
                    <ItemCard
                      key={item._id || `${item.schoolName}-${index}`}
                      title={
                        item.schoolName
                          ? item.schoolName
                          : t("itemTitles.education", { number: index + 1 })
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label={t("fields.schoolType")}
                          value={getEducationTypeLabel(item.educationType)}
                        />

                        <Field
                          label={t("fields.schoolName")}
                          value={displayValue(item.schoolName)}
                        />

                        <Field
                          label={t("fields.majorCourse")}
                          value={displayValue(item.major)}
                        />

                        <Field
                          label={t("fields.enrollmentDate")}
                          value={formatDate(item.enrollmentDate, locale)}
                        />

                        <Field
                          label={t("fields.graduationDate")}
                          value={formatDate(item.graduationDate, locale)}
                        />

                        <Field
                          label={t("fields.graduationStatus")}
                          value={getGraduationStatusLabel(
                            item.graduationStatus,
                          )}
                        />
                      </FieldGrid>
                    </ItemCard>
                  ))}
                </Box>
              )}
            </Section>

            {/* JAPANESE / QUALIFICATIONS */}
            <Section title={t("sections.japaneseQualifications")}>
              <Field
                label={t("fields.japaneseLanguageLevel")}
                value={
                  profile?.japaneseLanguageLevel ? (
                    <StatusBadge>
                      {getJapaneseLevelLabel(profile.japaneseLanguageLevel)}
                    </StatusBadge>
                  ) : (
                    "-"
                  )
                }
              />

              <Box sx={{ mt: 3 }}>
                {qualifications.length === 0 ? (
                  <EmptyNote>{t("empty.qualifications")}</EmptyNote>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {qualifications.map((item, index) => (
                      <ItemCard
                        key={item._id || `${item.name}-${index}`}
                        title={
                          item.name ||
                          t("itemTitles.qualification", { number: index + 1 })
                        }
                      >
                        <FieldGrid min={180}>
                          <Field
                            label={t("fields.qualificationCertificate")}
                            value={displayValue(item.name)}
                          />

                          <Field
                            label={t("fields.levelScore")}
                            value={displayValue(item.levelOrScore)}
                          />

                          <Field
                            label={t("fields.issuer")}
                            value={displayValue(item.issuer)}
                          />

                          <Field
                            label={t("fields.acquiredDate")}
                            value={formatDate(item.acquiredDate, locale)}
                          />

                          <Field
                            label={t("fields.expiryDate")}
                            value={formatDate(item.expiryDate, locale)}
                          />

                          <Field
                            label={t("fields.note")}
                            value={displayValue(item.note)}
                          />
                        </FieldGrid>
                      </ItemCard>
                    ))}
                  </Box>
                )}
              </Box>
            </Section>

            {/* EMPLOYMENT */}
            <Section
              title={t("sections.employment")}
              description={t("descriptions.employment")}
            >
              {employmentHistory.length === 0 ? (
                <EmptyNote>{t("empty.employment")}</EmptyNote>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {employmentHistory.map((item, index) => (
                    <ItemCard
                      key={item._id || `${item.companyName}-${index}`}
                      title={
                        item.companyName
                          ? item.companyName
                          : t("itemTitles.employment", { number: index + 1 })
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label={t("fields.companyName")}
                          value={displayValue(item.companyName)}
                        />

                        <Field
                          label={t("fields.employmentType")}
                          value={getEmploymentTypeLabel(item.employmentType)}
                        />

                        <Field
                          label={t("fields.department")}
                          value={displayValue(item.department)}
                        />

                        <Field
                          label={t("fields.jobTitle")}
                          value={displayValue(item.jobTitle)}
                        />

                        <Field
                          label={t("fields.workLocation")}
                          value={displayValue(item.workLocation)}
                        />

                        <Field
                          label={t("fields.startDate")}
                          value={formatDate(item.startDate, locale)}
                        />

                        <Field
                          label={t("fields.endDate")}
                          value={
                            item.isCurrent
                              ? t("employment.currentlyEmployed")
                              : formatDate(item.endDate, locale)
                          }
                        />
                      </FieldGrid>

                      {(item.responsibilities || item.achievements) && (
                        <>
                          <Divider sx={{ my: 2.5, borderColor: HAIRLINE }} />

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                md: "repeat(2, minmax(0, 1fr))",
                              },
                              gap: { xs: 2, md: 3 },
                            }}
                          >
                            <Field
                              label={t("fields.responsibilities")}
                              value={displayValue(item.responsibilities)}
                            />

                            <Field
                              label={t("fields.achievements")}
                              value={displayValue(item.achievements)}
                            />
                          </Box>
                        </>
                      )}
                    </ItemCard>
                  ))}
                </Box>
              )}
            </Section>

            {/* SKILLS / CAREER */}
            <Section title={t("sections.skillsCareer")}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "minmax(0, 1fr) minmax(0, 1.5fr)",
                  },
                  gap: { xs: 2.5, md: 3 },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      mb: 1,
                      color: MUTED,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {t("fields.skills")}
                  </Typography>

                  {skills.length === 0 ? (
                    <Typography sx={{ color: INK, fontSize: 14.5 }}>
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {skills.map((skill, index) => (
                        <Box
                          key={`${skill}-${index}`}
                          sx={{
                            px: 1.25,
                            py: 0.6,
                            borderRadius: 999,
                            bgcolor: BRAND_SOFT,
                            color: BRAND_DEEP,
                            fontSize: 12.5,
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Field
                  label={t("fields.careerSummary")}
                  value={displayValue(profile?.careerSummary)}
                />
              </Box>
            </Section>

            {/* APPLICATION CONTENT */}
            <Section
              title={t("sections.applicationContent")}
              description={t("descriptions.applicationContent")}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Field
                  label={t("fields.motivation")}
                  value={displayValue(profile?.motivation)}
                />

                <Field
                  label={t("fields.selfPr")}
                  value={displayValue(profile?.selfPR)}
                />

                <Field
                  label={t("fields.desiredConditions")}
                  value={displayValue(profile?.desiredConditions)}
                />
              </Box>
            </Section>

            {/* REMARKS / PROGRESS / PAYMENTS
                These components render their own content, so they get the
                same card shell as every other section. */}
            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
              <Remarks clientId={client.clientId} />
            </Box>

            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
              <Progress clientId={client.clientId} />
            </Box>

            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
              <Payments clientId={client.clientId} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =================================================
      PHOTO LIGHTBOX
      ================================================= */}

      <Dialog
        open={photoOpen && hasPhoto}
        onClose={() => setPhotoOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              m: { xs: 2, sm: 3 },
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              alignItems: "center",
            },
          },
          backdrop: {
            sx: { bgcolor: "rgba(10,20,17,0.78)" },
          },
        }}
      >
        <IconButton
          onClick={() => setPhotoOpen(false)}
          aria-label={t("photo.close")}
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            zIndex: 1,
            bgcolor: SURFACE,
            color: INK,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            "&:hover": { bgcolor: "#F3F4F6" },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>

        <Box
          component="img"
          src={candidatePhotoUrl}
          alt={client.fullName || t("photo.alt")}
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "82vh",
            objectFit: "contain",
            borderRadius: 2.5,
            bgcolor: SURFACE,
          }}
        />
      </Dialog>
    </Box>
  );
};

export default ClientDetail;
