"use client";

// new code

import React, { useEffect, useMemo, useRef, useState } from "react";

import countryList from "react-select-country-list";

import { IoIosAddCircle } from "react-icons/io";
import { FaRegTimesCircle, FaTimesCircle } from "react-icons/fa";

import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";
import TextInput from "@/components/UIComponent/InputField/TextInput";
import SingleSelect from "@/components/UIComponent/InputField/SingleSelect";
import MultipleSelect from "@/components/UIComponent/InputField/MultipleSelect";
import { countryData } from "@/utils/countryData";
import FileUploadMultiple from "@/components/UIComponent/InputField/FileUploadMultiple";
import useApplicantMutations from "./ApplicantMutation";

interface Address {
  countryName: string;
  state: string;
  district: string;
  municipality: string;
  city: string;
  zipPostal: string;
  street: string;
}

interface AcademicRecord {
  id: string;
  academicId?: string;
  institution: string;
  degreeTitle: string;
  degreeLevel: string;
  passedYear: string;
  courseStart: string;
  courseEnd: string;
  subject: string;
  percentage: string;
  gpa: string;
  gradeType: "percentage" | "gpa";
}

interface TestScore {
  id: string;
  testId?: string;
  testType: string;
  overall: string;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  attendedDate: string;
}

interface Document {
  id: number;
  documentId: string;
  fileUrl: string;
  applicantId: string;
}

const AddApplicants = ({ applicant }: { applicant?: any }) => {
  console.log("applicant Data", applicant);
  const navigationItems = [
    {
      id: 1,
      name: "Leads",
      value: "Leads",
      color: "bg-red-500",
      textColor: "text-white",
    },
    {
      id: 2,
      name: "Inquiring",
      value: "Inquiring",
      color: "bg-blue-800",
      textColor: "text-white",
    },
    {
      id: 3,
      name: "Abroad Enrollment",
      value: "AbroadEnrollment",
      color: "bg-yellow-400",
      textColor: "text-white",
    },
  ];

  const [activeNav, setActiveNav] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [leadType, setLeadType] = useState("Leads");

  const handleOuterTabClick = (id: number) => {
    setActiveNav(id);
    const lead = navigationItems.find((nav: any) => nav.id === id)?.value;
    setLeadType(lead || "Leads");

    setActiveTab(1); // Reset the inner tab to the first one when outer tab changes
  };
  console.log("lead type ", leadType);
  const tabs = [
    { id: 1, name: "Applicant Data" },
    { id: 2, name: "Address" },
    { id: 3, name: "Academics" },
    { id: 4, name: "Score" },
    { id: 5, name: "Documents" },
    { id: 6, name: "Summary" },
  ];

  // Applicant Data Code
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const options = useMemo(() => countryList().getData(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [addApplicantData, setAddApplicant] = useState({
    name: "",
    email: "",
    secondaryEmail: "",
    phoneNumber: "",
    secondaryPhone: "",
    dateOfBirth: "",
    gender: "",
    reference: "",
    interestedCountries: "",
    interestedCourse: "",
    tags: "",
    counselor: "",
    quickAppointment: false,
    checkboxemail: false,
    countryName: "",
  });

  useEffect(() => {
    if (applicant) {
      setAddApplicant({
        name: applicant?.name || "",
        email: applicant?.email || "",
        secondaryEmail: applicant?.secondaryEmail || "",
        phoneNumber: applicant?.phoneNumber || "",
        secondaryPhone: applicant?.secondaryPhone || "",
        dateOfBirth: applicant?.dateOfBirth || "",
        gender: applicant?.gender || "",
        reference: applicant?.reference || "",
        interestedCountries: applicant?.interestedCountries || "",
        interestedCourse: applicant?.interestedCourse || "",
        tags: applicant?.tags || "",
        counselor: applicant?.counselor || "",
        quickAppointment: applicant?.quickAppointment || false,
        checkboxemail: applicant?.checkboxEmail || false,
        countryName: applicant?.address?.countryName || "",
      });
    }
  }, [applicant]);

  // const genderOptions = ["Male", "Female", "Other"];
  const referenceOptions = ["Google", "Friend", "Advertisement", "Other"];

  const handleChangeApplicantData = (
    field: keyof typeof addApplicantData,
    value: any
  ) => {
    setAddApplicant({
      ...addApplicantData,
      [field]: value,
    });
  };

  const [selectReference, setSelectedReference] = useState("");

  const handleReference = (value: string): void => {
    setSelectedReference(value);
    setAddApplicant({
      ...addApplicantData,
      reference: value,
    });
  };

  const handleCountryChange = (items: string[]): void => {
    setSelectedCountries(items);
    setAddApplicant({
      ...addApplicantData,
      interestedCountries: items.join(", "),
    });
  };

  const renderItems = (item: string): JSX.Element => {
    const isSelected = selectedCountries.includes(item);

    return (
      <div className="flex justify-between">
        <div>{item}</div>
        {isSelected && (
          <div>
            <svg
              className="ml-2 h-4 w-4 fill-current text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M17.293 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L6 14.086l10.293-10.293a1 1 0 0 1 1.414 0z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  // Address
  const [clearOnSuccess, setClearOnSuccess] = useState(false);
  const [addAddress, setAddAddress] = useState<Address>({
    countryName: "",
    city: "",
    state: "",
    district: "",
    municipality: "",
    zipPostal: "",
    street: "",
  });

  useEffect(() => {
    if (applicant?.address) {
      setAddAddress({
        countryName: applicant.address.countryName || "",
        city: applicant.address.city || "",
        state: applicant.address?.state || "",
        district: applicant.address.district || "",
        municipality: applicant.address.municipality || "",
        zipPostal: applicant.address.zipPostal || "",
        street: applicant.address.street || "",
      });
    }
  }, [applicant?.address]);

  const handleChangeAddress = (field: keyof Address, value: string) => {
    setAddAddress({
      ...addAddress,
      [field]: value,
    });
  };

  const uniqueProvinces: string[] = Array.from(
    new Set<string>(
      countryData
        .flatMap((data) =>
          data.Additional?.map((additionalData) => additionalData.Province)
        )
        .filter((province): province is string => typeof province === "string")
    )
  );

  const uniqueDistricts: string[] = Array.from(
    new Set<string>(
      countryData
        .flatMap((data) =>
          data.Additional?.map((additionalData) => additionalData.District)
        )
        .filter((district): district is string => typeof district === "string")
    )
  );

  const uniqueMunicipalities: string[] = Array.from(
    new Set<string>(
      countryData
        .flatMap((data) =>
          data.Additional?.map((additionalData) => additionalData.Municipality)
        )
        .filter(
          (municipality): municipality is string =>
            typeof municipality === "string"
        )
    )
  );

  // Academics
  const [pastPreviousAcademic, setPreviousAcademic] = useState<
    AcademicRecord[]
  >([
    {
      id: "",
      institution: "",
      degreeTitle: "",
      degreeLevel: "",
      passedYear: "",
      courseStart: "",
      courseEnd: "",
      subject: "",
      percentage: "",
      gpa: "",
      gradeType: "percentage",
    },
  ]);

  useEffect(() => {
    if (applicant?.academicRecords?.length > 0) {
      setPreviousAcademic(
        applicant?.academicRecords?.map((record: AcademicRecord) => ({
          id: record?.academicId || "",
          institution: record?.institution || "",
          degreeTitle: record?.degreeTitle || "",
          degreeLevel: record?.degreeLevel || "",
          passedYear: record?.passedYear || "",
          courseStart: record?.courseStart || "",
          courseEnd: record?.courseEnd || "",
          subject: record?.subject || "",
          percentage: record?.percentage?.toString() || "",
          gpa: record?.gpa?.toString() || null,
          gradeType: record?.gradeType || "percentage",
        }))
      );
    }
  }, [applicant]);

  const addPreviousAcademic = () => {
    setPreviousAcademic((prevData) => [
      ...prevData,
      {
        id: "",
        institution: "",
        degreeTitle: "",
        degreeLevel: "",
        passedYear: "",
        courseStart: "",
        courseEnd: "",
        subject: "",
        percentage: "",
        gpa: "",
        gradeType: "percentage",
      },
    ]);
  };

  const genderOptions = ["Male", "Female", "Other"];
  const handleChange = (field: keyof AcademicRecord, value: any) => {
    setPreviousAcademic({
      ...pastPreviousAcademic,
      [field]: value,
    });
  };

  const handlePastAcademicChange = (
    index: number,
    field: keyof AcademicRecord,
    value: string
  ) => {
    setPreviousAcademic((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [field]: value,
      };
      return updatedData;
    });
  };
  const handleGradeTypeChange = (
    index: number,
    value: "percentage" | "gpa"
  ) => {
    setPreviousAcademic((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        gradeType: value,
        percentage: value === "percentage" ? "" : updatedData[index].percentage,
        gpa: value === "gpa" ? "" : updatedData[index].gpa,
      };
      return updatedData;
    });
  };

  const handlePreviousAcademicRemove = (index: number) => {
    setPreviousAcademic((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Score
  const [testScores, setTestScores] = useState<TestScore[]>([
    {
      id: "",
      testType: "",
      overall: "",
      listening: "",
      reading: "",
      writing: "",
      speaking: "",
      attendedDate: "",
    },
  ]);

  useEffect(() => {
    if (applicant?.testScores?.length) {
      setTestScores(
        applicant.testScores.map((score: TestScore) => ({
          id: score.testId || "",
          testType: score.testType || "",
          overall: score.overall || "",
          listening: score.listening || "",
          reading: score.reading || "",
          writing: score.writing || "",
          speaking: score.speaking || "",
          attendedDate: score.attendedDate || "",
        }))
      );
    }
  }, [applicant]);

  const addTestScore = () => {
    setTestScores([
      ...testScores,
      {
        id: "",
        testType: "",
        overall: "",
        listening: "",
        reading: "",
        writing: "",
        speaking: "",
        attendedDate: "",
      },
    ]);
  };

  const handleTestScoreChange = (
    index: number,
    field: keyof TestScore,
    value: any
  ) => {
    setTestScores((prevData: any) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [field]: value,
      };
      return updatedData;
    });
  };

  const removeTestScore = (index: number) => {
    setTestScores((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Documents
  const [documents, setDocuments] = useState<File[] | null>(null);

  useEffect(() => {
    if (applicant?.documents?.length) {
      setDocuments(
        applicant.documents.map((doc: Document) => ({
          documentId: doc.documentId,
          fileUrl: doc.fileUrl,
        }))
      );
    }
  }, [applicant]);

  const handleFilesSelected = (files: File[] | null) => {
    setDocuments(files);
  };

  // Summary
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (applicant?.summary) {
      setDescription(applicant?.summary);
    }
  }, [applicant]);
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { createApplicants } = useApplicantMutations();

  const handleSubmit = async () => {
    const formData = new FormData();
    setIsLoading(true);

    try {
      if (addApplicantData?.gender === "" && addApplicantData.name === "") {
        setErrorMessage("Name and Gender must have value");
        return;
      }
      const dataToSend = {
        leadType: leadType,
        applicantData: addApplicantData,
        address: addAddress,
        academics: pastPreviousAcademic,
        score: testScores,
        summary: description,
        applicantId: applicant?.applicantId || "",
        academicid: applicant?.academicRecords?.academicId || "",
      };

      console.log("data", dataToSend);
      formData.append("description", JSON.stringify(dataToSend));

      if (documents) {
        documents.forEach((file, index) => {
          formData.append("applicantData", file);
        });
      }

      const response = await createApplicants(formData);
      if (response?.success) {
        setAddAddress({
          countryName: "",
          city: "",
          state: "",
          district: "",
          municipality: "",
          zipPostal: "",
          street: "",
        });
        setSuccessMessage(response?.success);
        setErrorMessage("");
        setIsFormValid(false);
        setClearOnSuccess(true);
      } else {
        setErrorMessage("error");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Failed to add Data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, errorMessage]);

  return (
    <div>
      <div>
        {/* Outer Navigation */}
        <div className="flex flex-wrap justify-around div-4 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          {navigationItems.map((navItem) => (
            <button
              key={navItem.id}
              onClick={() => handleOuterTabClick(navItem.id)}
              className={`flex items-center justify-center m-2 px-4 py-2 rounded-xl transition-colors duration-200 text-xs sm:text-xs md:text-xs w-full sm:w-auto ${
                activeNav === navItem.id
                  ? `${navItem.color} ${navItem.textColor}`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{navItem.name}</span>
            </button>
          ))}
        </div>

        {/* Inner Tabs */}
        <div className="flex flex-wrap justify-around div-4 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center m-2 px-4 py-2 rounded-xl transition-colors duration-200 text-xs sm:text-xs md:text-xs w-full sm:w-auto ${
                activeTab === tab.id
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Inner Tab Content */}
        <div className="div-4 bg-white rounded-xl shadow-md border border-gray-200">
          {activeTab === 1 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-5">
              <div className="mb-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3 p-4">
                <div>
                  <TextInput
                    required={true}
                    type={"text"}
                    label="Name*"
                    classNames="text-xs"
                    values={addApplicantData.name}
                    clearOnSuccess={clearOnSuccess}
                    onChange={(value) =>
                      handleChangeApplicantData("name", value)
                    }
                    placeholder="Enter Name"
                  />
                </div>
                <div>
                  <TextInput
                    required={true}
                    type={"email"}
                    label="Email*"
                    classNames="text-xs"
                    values={addApplicantData.email}
                    clearOnSuccess={clearOnSuccess}
                    onChange={(value) =>
                      handleChangeApplicantData("email", value)
                    }
                    placeholder="Enter Email"
                  />
                </div>
                <div>
                  <TextInput
                    required={true}
                    type={"email"}
                    label="Secondary Email*"
                    classNames="text-xs"
                    values={addApplicantData.secondaryEmail}
                    clearOnSuccess={clearOnSuccess}
                    onChange={(value) =>
                      handleChangeApplicantData("secondaryEmail", value)
                    }
                    placeholder="Enter Secondary Email"
                  />
                </div>
                <div>
                  <TextInput
                    required={true}
                    type={"phone"}
                    label="Phone Number*"
                    classNames="text-xs"
                    values={addApplicantData?.phoneNumber}
                    clearOnSuccess={clearOnSuccess}
                    onChange={(value) =>
                      handleChangeApplicantData("phoneNumber", value)
                    }
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div>
                  <TextInput
                    type={"phone"}
                    label="Secondary Phone Number"
                    classNames="text-xs"
                    values={addApplicantData?.secondaryPhone}
                    clearOnSuccess={clearOnSuccess}
                    onChange={(value) =>
                      handleChangeApplicantData("secondaryPhone", value)
                    }
                    placeholder="Enter Secondary Phone Number"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-2">
                  <div className="flex flex-col">
                    <label className="text-xs mb-2 font-medium text-gray-900 dark:text-white">
                      Date of Birth*
                    </label>

                    <input
                      required
                      type={"date"}
                      className="text-xs bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={addApplicantData?.dateOfBirth}
                      onChange={(e) =>
                        handleChangeApplicantData("dateOfBirth", e.target.value)
                      }
                      placeholder="Enter DOB"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="text-xs font-medium text-gray-900 dark:text-white">
                      Gender*
                    </label>
                    <select
                      required
                      className="w-full div-2 border border-gray-300 rounded text-xs"
                      value={addApplicantData.gender}
                      onChange={(e) =>
                        handleChangeApplicantData("gender", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-900 dark:text-white">
                    Reference
                  </label>
                  <SingleSelect
                    value={selectReference}
                    onChange={handleReference}
                    render={(item) => <span>{item}</span>}
                    items={referenceOptions}
                  />
                  <p className="text-xs">
                    {" "}
                    Selected: {addApplicantData?.reference}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-900 dark:text-white">
                    Interested Countries
                  </label>
                  <MultipleSelect
                    items={options.map((option) => option.label)}
                    value={selectedCountries}
                    onChange={handleCountryChange}
                    render={renderItems}
                  />
                  <p className="text-xs">
                    Selected: {addApplicantData?.interestedCountries}
                  </p>
                </div>
                <div>
                  <TextInput
                    type={"text"}
                    label="Interested Course"
                    classNames="text-xs"
                    clearOnSuccess={clearOnSuccess}
                    values={addApplicantData?.interestedCourse}
                    onChange={(value) =>
                      handleChangeApplicantData("interestedCourse", value)
                    }
                    placeholder="Enter Interested Course"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-900 dark:text-white">
                    Tags
                  </label>
                  <SingleSelect
                    value={addApplicantData?.tags || ""}
                    onChange={(value) =>
                      handleChangeApplicantData("tags", value)
                    }
                    render={(item) => <span>{item}</span>}
                    items={referenceOptions}
                  />
                  <p className="text-xs">
                    {" "}
                    Selected tags: {addApplicantData?.tags}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-900 dark:text-white">
                    Counselor
                  </label>
                  <SingleSelect
                    value={addApplicantData?.counselor}
                    onChange={(value) =>
                      handleChangeApplicantData("counselor", value)
                    }
                    render={(item) => <span>{item}</span>}
                    items={referenceOptions}
                  />
                  <p className="text-xs">
                    {" "}
                    Selected Counselor: {addApplicantData?.counselor}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-6 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={addApplicantData?.quickAppointment}
                      onChange={(e) =>
                        handleChangeApplicantData(
                          "quickAppointment",
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-xs">Quick appointment</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={addApplicantData?.checkboxemail}
                      onChange={(e) =>
                        handleChangeApplicantData(
                          "checkboxemail",
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-xs">Email</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <div className="col-span-1 md:col-span-2 lg:col-span-5">
                <div className="mb-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3 p-4">
                  <div className="flex-1 basis-[100%] md:basis-[50%] lg:basis-[25%]">
                    <label
                      htmlFor="country"
                      className="block text-xs font-semibold"
                    >
                      Country (*):
                    </label>
                    <select
                      id="country"
                      required
                      name="country"
                      className="w-full rounded-md border div-2 text-xs"
                      value={addAddress.countryName}
                      onChange={(e) =>
                        handleChangeAddress("countryName", e.target.value)
                      }
                    >
                      <option value="">Select Country</option>
                      {Array.from(
                        new Set(countryData.map((data) => data.Country))
                      ).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 basis-[100%] md:basis-[50%] lg:basis-[25%]">
                    <label
                      htmlFor="state"
                      className="block text-xs font-semibold"
                    >
                      State (*):
                    </label>
                    <select
                      required
                      id="state"
                      name="state"
                      className="w-full rounded-md border div-2 text-xs"
                      value={addAddress.state}
                      onChange={(e) =>
                        handleChangeAddress("state", e.target.value)
                      }
                    >
                      <option value="">Select Province</option>
                      {uniqueProvinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 basis-[100%] md:basis-[50%] lg:basis-[25%]">
                    <label
                      htmlFor="district"
                      className="block text-xs font-semibold"
                    >
                      District (*):
                    </label>
                    <select
                      required
                      id="district"
                      name="district"
                      className="w-full rounded-md border div-2 text-xs"
                      value={addAddress.district}
                      onChange={(e) =>
                        handleChangeAddress("district", e.target.value)
                      }
                    >
                      <option value="">Select District</option>
                      {uniqueDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district.charAt(0).toUpperCase() +
                            district.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 basis-[100%] md:basis-[50%] lg:basis-[25%]">
                    <label
                      htmlFor="municipality"
                      className="block text-xs font-semibold"
                    >
                      Municipality*
                    </label>
                    <select
                      required
                      id="municipality"
                      name="municipality"
                      className="w-full rounded-md border div-2 text-xs"
                      value={addAddress.municipality}
                      onChange={(e) =>
                        handleChangeAddress("municipality", e.target.value)
                      }
                    >
                      <option value="">Select Municipality</option>
                      {uniqueMunicipalities.map((municipality) => (
                        <option key={municipality} value={municipality}>
                          {municipality}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <TextInput
                      type="text"
                      required
                      label="City*"
                      classNames="text-xs"
                      values={addAddress.city}
                      clearOnSuccess={clearOnSuccess}
                      onChange={(value) => handleChangeAddress("city", value)}
                      placeholder="Enter City"
                    />
                  </div>
                  <div>
                    <TextInput
                      type="text"
                      required
                      label="Zip/Postal Code"
                      classNames="text-xs"
                      values={addAddress.zipPostal}
                      clearOnSuccess={clearOnSuccess}
                      onChange={(value) =>
                        handleChangeAddress("zipPostal", value)
                      }
                      placeholder="Enter Zip/Postal Code"
                    />
                  </div>
                  <div>
                    <TextInput
                      type="text"
                      required
                      label="Street"
                      classNames="text-xs"
                      values={addAddress.street}
                      clearOnSuccess={clearOnSuccess}
                      onChange={(value) => handleChangeAddress("street", value)}
                      placeholder="Enter Street"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <div>
                <div>
                  {pastPreviousAcademic.map((academic, index) => (
                    <div
                      key={academic.id}
                      className=" p-4 col-span-1 md:col-span-2 lg:col-span-5 mb-4"
                    >
                      <div className="mb-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3 p-4">
                        <div>
                          <TextInput
                            required
                            type={"text"}
                            label="Institution*"
                            classNames="text-xs"
                            values={academic?.institution || ""}
                            clearOnSuccess={clearOnSuccess}
                            onChange={(value) =>
                              handlePastAcademicChange(
                                index,
                                "institution",
                                value
                              )
                            }
                            placeholder="Enter Institution Name"
                          />
                        </div>
                        <div>
                          <TextInput
                            type={"text"}
                            label="Degree Title"
                            classNames="text-xs"
                            values={academic?.degreeTitle || ""}
                            clearOnSuccess={clearOnSuccess}
                            onChange={(value) =>
                              handlePastAcademicChange(
                                index,
                                "degreeTitle",
                                value
                              )
                            }
                            placeholder="Enter Degree Title"
                          />
                        </div>
                        <div>
                          <TextInput
                            required
                            type={"text"}
                            label="Degree Level*"
                            classNames="text-xs"
                            values={academic?.degreeLevel || ""}
                            clearOnSuccess={clearOnSuccess}
                            onChange={(value) =>
                              handlePastAcademicChange(
                                index,
                                "degreeLevel",
                                value
                              )
                            }
                            placeholder="Enter Degree Level"
                          />
                        </div>
                        <div>
                          <TextInput
                            required
                            type={"text"}
                            label="Passed Year*"
                            classNames="text-xs"
                            values={academic?.passedYear || ""}
                            clearOnSuccess={clearOnSuccess}
                            onChange={(value) =>
                              handlePastAcademicChange(
                                index,
                                "passedYear",
                                value
                              )
                            }
                            placeholder="Enter Passed Year"
                          />
                        </div>
                        <div>
                          <label htmlFor="courseStart">Couse Start</label>
                          <input
                            type={"date"}
                            value={academic?.courseStart}
                            className="text-xs bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) =>
                              handlePastAcademicChange(
                                index,
                                "courseStart",
                                e.target.value
                              )
                            }
                            placeholder="Enter Course Start"
                          />
                        </div>
                        <div>
                          <label htmlFor="courseStart">Couse Start</label>
                          <input
                            type={"date"}
                            value={academic?.courseEnd || ""}
                            className="text-xs bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) =>
                              handlePastAcademicChange(
                                index,
                                "courseEnd",
                                e.target.value
                              )
                            }
                            placeholder="Enter Course End"
                          />
                        </div>

                        <div>
                          <TextInput
                            type={"text"}
                            label="Subject"
                            values={academic?.subject || ""}
                            classNames="text-xs"
                            clearOnSuccess={clearOnSuccess}
                            onChange={(value) =>
                              handlePastAcademicChange(index, "subject", value)
                            }
                            placeholder="Enter Subject"
                          />
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <div className="flex items-center space-x-2">
                            <label className="text-xs font-medium text-gray-900 dark:text-white">
                              Percentage
                            </label>
                            <input
                              type="radio"
                              name={`gradeType-${academic.id}`}
                              value={"percentage"}
                              checked={academic.gradeType === "percentage"}
                              onChange={() =>
                                handleGradeTypeChange(index, "percentage")
                              }
                            />
                            <label className="text-xs font-medium text-gray-900 dark:text-white">
                              GPA
                            </label>
                            <input
                              type="radio"
                              name={`gradeType-${academic.id}`}
                              value="gpa"
                              checked={academic.gradeType === "gpa"}
                              onChange={() =>
                                handleGradeTypeChange(index, "gpa")
                              }
                            />
                          </div>
                          {academic.gradeType === "percentage" ? (
                            <div>
                              <TextInput
                                type={"text"}
                                classNames="text-xs"
                                values={academic?.percentage || ""}
                                clearOnSuccess={clearOnSuccess}
                                onChange={(value) =>
                                  handlePastAcademicChange(
                                    index,
                                    "percentage",
                                    value
                                  )
                                }
                                placeholder="Enter Percentage (0-100)"
                              />
                            </div>
                          ) : (
                            <div>
                              <TextInput
                                type={"text"}
                                classNames="text-xs"
                                values={academic?.gpa || ""}
                                clearOnSuccess={clearOnSuccess}
                                onChange={(value) =>
                                  handlePastAcademicChange(index, "gpa", value)
                                }
                                placeholder="Enter GPA (0-4.0)"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-red-500 text-xs"
                            onClick={() => handlePreviousAcademicRemove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="ml-4">
                    <button
                      type="button"
                      className="text-white text-xs border p-2 bg-blue-500 rounded-lg"
                      onClick={addPreviousAcademic}
                    >
                      Add More Academic Records
                    </button>
                  </div>
                </div>
                <hr className="border-1 border-gray-300 my-4" />
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <div>
                <div className="ml-1 md:ml-2 p-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="me-2 rounded-lg bg-blue-700 p-2 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                      onClick={addTestScore}
                    >
                      <IoIosAddCircle />
                    </button>
                  </div>
                  <div className=" text-gray-500 dark:text-gray-400">
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="m-2 w-full text-left text-xs text-gray-500 rtl:text-right dark:text-gray-400">
                          <thead className="bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                SELECT TEST*
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                OVERALL
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                L
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                R
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                W
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                S
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                ATTENDED DATE
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                              >
                                ACTION
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {testScores.map((score, index) => (
                              <tr key={score.id}>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <select
                                      required
                                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 div-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                      value={score.testType}
                                      onChange={(e) =>
                                        handleTestScoreChange(
                                          index,
                                          "testType",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="" disabled>
                                        Select Test
                                      </option>
                                      <option value="TOEFL">TOEFL</option>
                                      <option value="IELTS">IELTS</option>
                                      <option value="GRE">GRE</option>
                                      <option value="GMAT">GMAT</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <TextInput
                                      type={"text"}
                                      classNames="text-xs"
                                      values={score?.overall}
                                      clearOnSuccess={clearOnSuccess}
                                      onChange={(value) =>
                                        handleTestScoreChange(
                                          index,
                                          "overall",
                                          value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <TextInput
                                      type={"text"}
                                      classNames="text-xs"
                                      values={score?.listening}
                                      clearOnSuccess={clearOnSuccess}
                                      onChange={(value) =>
                                        handleTestScoreChange(
                                          index,
                                          "listening",
                                          value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <TextInput
                                      type={"text"}
                                      classNames="text-xs"
                                      values={score?.reading}
                                      clearOnSuccess={clearOnSuccess}
                                      onChange={(value) =>
                                        handleTestScoreChange(
                                          index,
                                          "reading",
                                          value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <TextInput
                                      type={"text"}
                                      classNames="text-xs"
                                      values={score?.writing}
                                      clearOnSuccess={clearOnSuccess}
                                      onChange={(value) =>
                                        handleTestScoreChange(
                                          index,
                                          "writing",
                                          value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <TextInput
                                      type={"text"}
                                      classNames="text-xs"
                                      values={score?.speaking}
                                      clearOnSuccess={clearOnSuccess}
                                      onChange={(value) =>
                                        handleTestScoreChange(
                                          index,
                                          "speaking",
                                          value
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-gray-900 dark:text-white">
                                  <div className="w-56">
                                    <input
                                      type={"date"}
                                      value={score?.attendedDate}
                                      className="text-xs bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      onChange={(e) =>
                                        handleTestScoreChange(
                                          index,
                                          "attendedDate",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter Attended date"
                                    />
                                  </div>
                                </td>
                                <td className="w-44 whitespace-nowrap px-1 py-1 font-medium text-center text-gray-900 dark:text-white">
                                  <button
                                    type="button"
                                    className="me-2 rounded-lg bg-red-700 p-2 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => removeTestScore(index)}
                                  >
                                    <FaRegTimesCircle />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Small Screen Layout */}
                    <div className="block md:hidden">
                      <div className="overflow-x-auto">
                        {testScores.map((score, index) => (
                          <div
                            key={score.id}
                            className="mb-2 rounded border bg-white div-2 text-xs"
                          >
                            <div>
                              <label htmlFor="">Select Test*</label>
                              <div className="w-full div-1">
                                <select
                                  required
                                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 div-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                  value={score.testType}
                                  onChange={(e) =>
                                    handleTestScoreChange(
                                      index,
                                      "testType",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select Test
                                  </option>
                                  <option value="TOEFL">TOEFL</option>
                                  <option value="IELTS">IELTS</option>
                                  <option value="GRE">GRE</option>
                                  <option value="GMAT">GMAT</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Overall</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  values={score?.overall}
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "overall",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Listening</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  values={score?.listening}
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "listening",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Reading</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  values={score?.reading}
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "reading",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Writing</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  values={score?.writing}
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "writing",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Speaking</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "speaking",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="">Attended Date</label>
                              <div className="w-full div-1">
                                <TextInput
                                  type={"text"}
                                  classNames="text-xs"
                                  values={score?.attendedDate}
                                  clearOnSuccess={clearOnSuccess}
                                  onChange={(value) =>
                                    handleTestScoreChange(
                                      index,
                                      "attendedDate",
                                      value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="mt-2 flex w-full justify-end">
                              <button
                                type="button"
                                className="me-2 rounded-lg bg-red-700 p-2 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                onClick={() => removeTestScore(index)}
                              >
                                <FaRegTimesCircle />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <div>
                <div className="div-4">
                  <label className="block text-gray-700 text-xs mb-2">
                    Attach Documents
                  </label>
                  <FileUploadMultiple
                    label="Click or Drag to Upload Files"
                    allowedTypes={["pdf", "docx", "doc"]}
                    onFilesSelected={handleFilesSelected}
                  />
                  {documents && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold mb-2">
                        Attached Documents:
                      </div>
                      <div className="flex items-center space-x-4">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="relative border div-2 rounded-md shadow-md bg-white"
                          >
                            <div className="w-24 h-24 flex flex-col justify-center items-center">
                              {doc.type === "application/pdf" ? (
                                <img
                                  src="/path/to/pdf-icon.png"
                                  alt="PDF"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex justify-center items-center bg-gray-200">
                                  <span className="text-xs text-gray-600">
                                    {doc.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const updatedDocs = documents.filter(
                                  (_, i) => i !== index
                                );
                                setDocuments(
                                  updatedDocs.length > 0 ? updatedDocs : null
                                );
                              }}
                              className="absolute top-0 right-0 mt-1 mr-1 text-red-500"
                            >
                              <FaTimesCircle />
                            </button>
                            <div className="text-xs text-center mt-2">
                              {doc.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <div className="mt-4">
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-xs text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-400 transition-all"
        >
          {applicant ? "Update" : "Save"}
        </button>
      </div>
      {successMessage && <SuccessNotification message={successMessage} />}
      {errorMessage && <FailedNotification message={errorMessage} />}
    </div>
  );
};

export default AddApplicants;
