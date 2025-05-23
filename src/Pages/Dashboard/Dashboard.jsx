import React from "react";
import Greeting from "../../Components/Greetings/Greetings";
import img from "../../assets/user-interface.gif";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UseWorksSpaces from "../../Hooks/UseWorksSpaces";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/UseAuth";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Importing icons
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { worksSpaces, worksSpacesRefetch } = UseWorksSpaces();

  const filtered = worksSpaces.filter(
    (w) => w.creatorEmail === user?.email || w.sharedWith.includes(user?.email)
  );

  const handleCreateWorkspace = async () => {
    const { value: workspaceName } = await Swal.fire({
      title: "Create New Workspace",
      input: "text",
      inputLabel: "Workspace Name",
      inputPlaceholder: "Enter workspace name",
      showCancelButton: true,
      confirmButtonText: "Create",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) return "Workspace name is required";
      },
    });

    if (workspaceName) {
      const getRandomLightColor = () => {
        const r = Math.floor(Math.random() * 156 + 100);
        const g = Math.floor(Math.random() * 156 + 100);
        const b = Math.floor(Math.random() * 156 + 100);
        return `rgba(${r}, ${g}, ${b}, 0.4)`;
      };

      const newWorkspace = {
        worksSpaceName: workspaceName,
        backgroundColor: getRandomLightColor(),
        creatorEmail: user?.email,
        sharedWith: [],
      };

      try {
        const res = await fetch("https://todayahead.vercel.app/works-spaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWorkspace),
        });

        const result = await res.json();
        if (result.insertedId) {
          toast.success("Workspace created successfully.");
          worksSpacesRefetch();
        } else {
          throw new Error("Failed to create workspace");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleDeleteWorkspace = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://todayahead.vercel.app/works-spaces/${id}`,
          {
            method: "DELETE",
          }
        );

        const data = await res.json();
        if (data.deletedCount > 0) {
          toast.success("Deleted Successfully");
          worksSpacesRefetch();
        } else {
          throw new Error("Failed to delete workspace");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleRenameWorkspace = async (workspace) => {
    const { value: newName } = await Swal.fire({
      title: "Rename Workspace",
      input: "text",
      inputValue: workspace.worksSpaceName,
      inputLabel: "New workspace name",
      showCancelButton: true,
      confirmButtonText: "Rename",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) return "Workspace name cannot be empty";
      },
    });

    if (newName && newName !== workspace.worksSpaceName) {
      try {
        const res = await fetch(
          `https://todayahead.vercel.app/works-spaces/${workspace._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ worksSpaceName: newName }),
          }
        );

        const data = await res.json();
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Workspace renamed successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          worksSpacesRefetch();
        } else {
          throw new Error("Failed to rename workspace");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="pb-8">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/* Greeting Section */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center  px-4 mt-5 md:mt-0">
        <Greeting />
        <img className="h-[250px]" src={img} alt="Dashboard Greeting" />
      </div>
      {/* Workspace Section */}
      <div className="grid gap-4 md:grid-cols-3 mt-4 px-4">
        {filtered.map((w) => (
          <div
            key={w._id}
            className="shadow-lg relative h-[150px] p-4 rounded-md text-black font-semibold text-lg"
            style={{
              backgroundColor: w.backgroundColor || "rgba(168, 85, 247, 0.4)",
            }}
          >
            <Link to={`/workspace/${w._id}`} className="block h-full">
              <div className="flex items-center justify-center h-full">
                {w.worksSpaceName}
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleRenameWorkspace(w)}
                className="text-blue-700 hover:text-blue-900"
                title="Rename"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleDeleteWorkspace(w._id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Create Button */}
      <div
        className="mt-8 px-6 py-2 bg-green-500 text-white w-fit rounded cursor-pointer hover:bg-green-600 mx-4"
        onClick={handleCreateWorkspace}
      >
        + Create New Workspace
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
