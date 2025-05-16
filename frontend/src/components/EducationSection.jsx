import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.educations || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyAttending: false,
  });
  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.fieldOfStudy &&
      newEducation.startYear
    ) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyAttending: false,
      });
    }
  };
  const handleCurrentlyAttendingChange = (e) => {
    setNewEducation({
      ...newEducation,
      currentlyAttending: e.target.checked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };
  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu._id !== id));
  };
  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
  };
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Education</h2>
      {educations.map((edu) => (
        <div key={edu._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <School size={20} className="mr-2 mt-1" />
            <div>
              <h3 className="font-semibold">{edu.fieldOfStudy}</h3>
              <p className="text-gray-600">{edu.school}</p>
              <p className="text-gray-500 text-sm">
                {edu.startYear} - {edu.endYear || "Present"}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteEducation(edu._id)}
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
                  placeholder="School"
                  value={newEducation.school}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, school: e.target.value })
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={newEducation.fieldOfStudy}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      fieldOfStudy: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Start Year"
                  value={newEducation.startYear}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      startYear: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="currentlyAttending"
                    checked={newEducation.currentlyAttending}
                    onChange={handleCurrentlyAttendingChange}
                    className="mr-2"
                  />
                  <label htmlFor="currentlyAttending">
                    I currently attend this school
                  </label>
                </div>
                {!newEducation.currentlyAttending && (
                  <input
                    type="text"
                    placeholder="End Year"
                    value={newEducation.endYear}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        endYear: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                )}
                <button
                  onClick={handleAddEducation}
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                >
                  Add education{" "}
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
                Edit Education
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default EducationSection;
