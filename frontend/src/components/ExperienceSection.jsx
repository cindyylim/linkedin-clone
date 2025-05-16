import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [experiences, setExperiences] = useState(userData.experience || []);
    const [newExperience, setNewExperience] = useState({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      currentlyWorking: false,
    });
    const handleAddExperience= () => {
      if (
        newExperience.title &&
        newExperience.company &&
        newExperience.startDate
      ) {
        setExperiences([...experiences, newExperience]);
        setNewExperience({
            title: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
            currentlyWorking: false,
        });
      }
    };
    const handleCurrentlyWorkingChange = (e) => {
      setNewExperience({
        ...newExperience,
        currentlyWorking: e.target.checked,
        endDate: e.target.checked ? "" : newExperience.endDate,
      });
    };
    const handleDeleteExperience = (id) => {
      setExperiences(experiences.filter((ex) => ex._id !== id));
    };
    const handleSave = () => {
      onSave({ experience: experiences });
      setIsEditing(false);
    };
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {experiences.map((ex) => (
          <div key={ex._id} className="mb-4 flex justify-between items-start">
            <div className="flex items-start">
              <Briefcase size={20} className="mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">{ex.fieldOfStudy}</h3>
                <p className="text-gray-600">{ex.school}</p>
                <p className="text-gray-500 text-sm">
                  {formatDate(ex.startDate)} - {formatDate(ex.endDate) || "Present"}
                </p>
              </div>
            </div>
            {isEditing && (
              <button
                onClick={() => handleDeleteExperience(ex._id)}
                className="text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
        {isOwnProfile && (
          <>
            {" "}
            {isEditing ? (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newExperience.title}
                    onChange={(e) =>
                        setNewExperience({ ...newExperience, title: e.target.value })
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        company: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={newExperience.startDate}
                    onChange={(e) =>
                        setNewExperience({
                        ...newExperience,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      checked={newExperience.currentlyWorking}
                      onChange={handleCurrentlyWorkingChange}
                      className="mr-2"
                    />
                    <label htmlFor="currentlyWorking">
                      I currently work at this company
                    </label>
                  </div>
                  {!newExperience.currentlyWorking && (
                    <input
                      type="date"
                      placeholder="End Year"
                      value={newExperience.endDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                  )}
                  <textarea
						placeholder='Description'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
                  <button
                    onClick={handleAddExperience}
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                  >
                    Add experience{" "}
                  </button>
                </div>
                <button
                  onClick={handleSave}
                  className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-primary hover:text-primary-dark transition duration-300"
                >
                  Edit Experiences
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
};
export default ExperienceSection;