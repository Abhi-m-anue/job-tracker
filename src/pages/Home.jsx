import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/Home.css";
import Axios from "axios";
import { FaEdit, FaChevronDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Input, TextInput, Button } from "@mantine/core";

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

  const handleEdit = (id) => {
    // when edit button is clicked
    open(); // open modal
    setFormData({
      // clear the formData from previous use
      company: "",
      position: "",
      status: "",
    });
    const job = jobs.find((job) => {
      // find the job to be edited using its id
      return job._id === id;
    });
    setSelectedJob(job);
  };

  const handleDelete = async (id) => {
    // try {
    //   const token = localStorage.getItem("jwtToken");
    //   if (token) {
    //     const response = await Axios.delete(
    //       `https://jobs-api-0v7l.onrender.com/api/v1/jobs/${selectedJob._id}`,
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     if (response.status === 200) {
    //         fetchdata();
    //     }
    //   } 
    // } catch (err) {}
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
            // fetchdata();
          setUpdateSuccess(true);
          setTimeout(() => {
            setUpdateSuccess(false);
            close();
          }, 1000);
        }
      } else {
        console.log(err);
        //redirect to session expired please login again page
      }
    } catch (err) {}
  };

  useEffect(() => {
    async function fetchdata() {
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
          //redirect to session expired please login again page
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchdata();
  }, []);
  return (
    <div>
      <Header />
      <div className="jobs-wrapper">
        {jobs.map((job, key) => {
          return (
            <div className="job-card">
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
      <Modal opened={opened} onClose={close} title="Edit Job" radius= "md" centered>
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
            {updateSuccess ? "Task updated" : "Confirm"}
          </Button>
        </form>
      </Modal>

      {/* <Button onClick={open}>Open centered Modal</Button> */}
    </div>
  );
};

export default Home;
