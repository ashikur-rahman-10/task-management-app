import React, { useEffect, useState } from "react";
import CustomLoader from "../../Components/customLoader/CustomLoader";
import { Helmet } from "react-helmet-async";
import useAuth from "../../Hooks/UseAuth";
import useThisUser from "../../Hooks/UseThisUser";

const Profile = () => {
  const { user } = useAuth();
  const email = user?.email;

  const { client, clientLoading } = useThisUser(email);
  const [localClient, setLocalClient] = useState(null);

  useEffect(() => {
    if (client) {
      setLocalClient(client);
    }
  }, [client]);

  if (clientLoading || !localClient) {
    return <CustomLoader />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const bio = event.target.bio.value;

    const updatedUser = {
      ...localClient,
      bio,
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.email === localClient.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setLocalClient(updatedUser);
    document.getElementById("my_modal_5").close();
  };

  return (
    <div className="w-full min-h-[90vh] flex items-center justify-center px-4">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center">
        <img
          className="w-48 h-48 rounded-full mt-10 outline outline-success hover:scale-150 hover:rounded-sm duration-1000"
          src={localClient?.photoURL}
          alt={`${localClient?.name}'s profile`}
        />
        <p className="text-center mt-4 max-w-[400px] text-[#737373]">
          {localClient?.bio}
        </p>
        <button
          className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          Edit Bio
        </button>
        <div className="mt-8">
          <h2 className="text-2xl">Name: {localClient?.name}</h2>
          <p className="text-xl">Email: {localClient?.email}</p>
        </div>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <div className="md:w-[450px] w-full px-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bio:
              </label>
              <textarea
                name="bio"
                required
                placeholder="your bio....."
                className="textarea textarea-info w-full h-40"
                defaultValue={localClient?.bio}
              ></textarea>
            </div>
            <div className="w-full flex justify-end pr-6 mt-2">
              <button
                type="submit"
                className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
