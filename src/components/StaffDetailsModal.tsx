import { X, GraduationCap, Briefcase, BookOpen, User, ArrowLeft } from 'lucide-react';
import type { StaffMember } from '../types/staff';

interface StaffDetailsModalProps {
  staff: StaffMember;
  onClose: () => void;
}

export function StaffDetailsModal({ staff, onClose }: StaffDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative my-8 shadow-lg max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            onClose(); // Close the modal and go back to the dashboard
          }}
          className="flex items-center mb-4 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6">
          <img
            src={staff.imageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
            alt={`${staff.firstName} ${staff.lastName}`}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-4 sm:mb-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {staff.firstName} {staff.lastName}
            </h2>
            <p className="text-gray-600">{staff.staffId}</p>
            <p className="text-gray-600">{staff.position}</p>
            <p className="text-gray-500">{staff.department}</p>
            <p className="text-gray-500">{staff.email}</p>
            <p className="text-gray-500">{staff.phoneNumber}</p>
          </div>
        </div>

        {staff.bio && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Biography</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{staff.bio}</p>
          </div>
        )}

        {staff.education && staff.education.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>
            <div className="space-y-4">
              {staff.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500">{edu.field} • {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {staff.experience && staff.experience.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>
            <div className="space-y-4">
              {staff.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {staff.research && staff.research.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Research</h3>
            </div>
            <div className="space-y-6">
              {staff.research.map((research, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-medium">{research.title}</h4>
                  <p className="text-gray-600">Area: {research.area}</p>
                  <p className="text-gray-700 mt-1">{research.description}</p>
                  {research.publications.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm text-gray-600">Publications:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                        {research.publications.map((pub, pubIndex) => (
                          <li key={pubIndex}>{pub}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
