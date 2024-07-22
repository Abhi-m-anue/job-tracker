import React, { useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import Header from "../components/Header";
import "../styles/Home.css";
import Axios from "axios";

import { FaEdit, FaChevronDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Input, TextInput, Button, Text, LoadingOverlay, Box} from "@mantine/core";

const Home = () => {
  const [jobs, setJobs] = useState([{}]); // store all jobs received from back-end
  const [selectedJob, setSelectedJob] = useState({}); // store the job which is clicked (for edit or delete)
  const [formData, setFormData] = useState({
    // store form data while editing
    company: "",
    position: "",
    status: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);


  const [opened, { open, close }] = useDisclosure(false); // modal open() and close() functions

  const [openedCreate,setOpenedCreate] = useState(false);
  const [createErrorCompany,setCreateErrorCompany] = useState("");
  const [createErrorPosition, setCreateErrorPosition] = useState("");

  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleEdit = (id) => {
    setFormData({
      // clear the formData from previous use
      company: "",
      position: "",
      status: "",
    });
    // when edit button is clicked
    open(); // open modal
    
    const job = jobs.find((job) => {
      // find the job to be edited using its id
      return job._id === id;
    });
    setSelectedJob(job);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const response = await Axios.delete(
          `https://jobs-api-0v7l.onrender.com/api/v1/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
       if(response.status === 200){
        fetchdata();
       }
      } 
    } catch (err) {
      //redirect to session expired
    }
  };

  const handleChange = (e) => {
    // when fields of edit job changes update the formData
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSelectChange = (e) => {
    // special handle function for status field as its key(status) is not
    setFormData({
      //available dynamicaly
      ...formData,
      status: e.target.value,
    });
  };

  const handleChangeCreate = (e)=>{
     const { name, value } = e.target;
     setFormData({
       ...formData,
       [name]: value,
     });
  }
  const handleSelectChangeCreate = (e)=>{
     setFormData({
       //available dynamicaly
       ...formData,
       status: e.target.value,
     });
  }
  const handleSubmitCreate = async (e)=>{
    e.preventDefault();
    if (formData.status === "") {
      formData.status = "pending";
    }
    setCreateErrorCompany("");
    setCreateErrorPosition("");
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const response = await Axios.post(
          `https://jobs-api-0v7l.onrender.com/api/v1/jobs/`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 201) {
          setFormData({
            // clear the formData from previous use
            company: "",
            position: "",
            status: "",
          });
          setUpdateSuccess(true);
          setTimeout(() => {
            setUpdateSuccess(false);
            setOpenedCreate(false);
            fetchdata();
          }, 1000);
        }
      } else {
        //redirect to session expired please login again page
      }
    } catch (err) {
      // deal with error
      let errTexts  = err.response.data.msg;
      errTexts = errTexts.split(',');
      for(let i=0;i<errTexts.length;i++){
        const errText = errTexts[i];
        if (errText.includes("company")) {
          setCreateErrorCompany(errText)
        }
        if (errText.includes("position")) {
          setCreateErrorPosition(errText)
        }
      }
    }
  }

  const handleSubmit = async (e) => {
    // update the job
    e.preventDefault();
    if (formData.company === "") {
      formData.company = selectedJob.company;
    }
    if (formData.position === "") {
      formData.position = selectedJob.position;
    }
    if (formData.status === "") {
      formData.status = selectedJob.status;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const response = await Axios.patch(
          `https://jobs-api-0v7l.onrender.com/api/v1/jobs/${selectedJob._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setFormData({
            // clear the formData from previous use
            company: "",
            position: "",
            status: "",
          });
          
          setUpdateSuccess(true);
          setTimeout(() => {
            setUpdateSuccess(false);
            close();
            fetchdata();
          }, 500);
        }
      } else {
        console.log(err);
        //redirect to session expired please login again page
      }
    } catch (err) {}
  };
  const fetchdata = async()=> {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const response = await Axios.get(
          "https://jobs-api-0v7l.onrender.com/api/v1/jobs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJobs(response.data.jobs);
      } else {
        navigate("/unauthorised")
        //redirect to session expired please login again page
      }
    } catch (err) {
      console.log(err)
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <div>
      <Header />
      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        <div className="create-new">
          <Text variant="gradient" fw={900} size="lg">
            Create new job
          </Text>
          <div
            onClick={() => {
              setFormData({
                // clear the formData from previous use
                company: "",
                position: "",
                status: "",
              });
              setCreateErrorCompany("");
              setCreateErrorPosition("");
              setOpenedCreate(true);
            }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <IoAddSharp fontSize={20} color="grey" />
          </div>
        </div>
        <div className="jobs-wrapper">
          {jobs.length > 0 &&
            jobs.map((job, key) => {
              return (
                <div key={key} className="job-card">
                  <div className="content">
                    <p>
                      Company :{" "}
                      <b style={{ color: "var(--mantine-color-blue-filled)" }}>
                        {job.company}
                      </b>
                    </p>
                    <p>
                      Position :{" "}
                      <b style={{ color: "var(--mantine-color-blue-filled)" }}>
                        {job.position}
                      </b>
                    </p>
                    <p>
                      Status :{" "}
                      <b style={{ color: "var(--mantine-color-blue-filled)" }}>
                        {job.status}
                      </b>
                    </p>
                  </div>
                  <div className="action">
                    <button onClick={() => handleEdit(job._id)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(job._id)}>
                      <MdDelete color="darkRed" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Job"
        radius="md"
        centered
      >
        <form>
          <TextInput
            label="Company"
            placeholder={selectedJob.company}
            onChange={handleChange}
            name="company"
            defaultValue={selectedJob.company}
          ></TextInput>
          <TextInput
            label="Position"
            placeholder={selectedJob.position}
            onChange={handleChange}
            name="position"
            defaultValue={selectedJob.position}
          ></TextInput>
          <Input
            component="select"
            rightSection={<FaChevronDown size={14} stroke={1.5} />}
            pointer
            mt="md"
            defaultValue={selectedJob.status}
            onChange={handleSelectChange}
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="declined">Declined</option>
          </Input>
          <Button
            type="submit"
            fullWidth
            style={{ marginTop: "15px" }}
            onClick={handleSubmit}
            color={updateSuccess ? "teal" : "blue"}
          >
            {updateSuccess ? "Job updated" : "Confirm"}
          </Button>
        </form>
      </Modal>

      <Modal
        opened={openedCreate}
        onClose={() => {
          setOpenedCreate(false);
        }}
        title="Create new job"
        radius="md"
        centered
      >
        <form>
          <TextInput
            label="Company"
            placeholder="Company name"
            onChange={handleChangeCreate}
            name="company"
            // error={createErrors.company}
            error={createErrorCompany}
          ></TextInput>
          <TextInput
            label="Position"
            placeholder="Position"
            onChange={handleChangeCreate}
            name="position"
            // error={createErrors.position}
            error={createErrorPosition}
          ></TextInput>
          <Input
            component="select"
            rightSection={<FaChevronDown size={14} stroke={1.5} />}
            pointer
            mt="md"
            onChange={handleSelectChangeCreate}
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="declined">Declined</option>
          </Input>
          <Button
            type="submit"
            fullWidth
            style={{ marginTop: "15px" }}
            onClick={handleSubmitCreate}
            color={updateSuccess ? "teal" : "blue"}
          >
            {updateSuccess ? "Job created" : "Confirm"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
