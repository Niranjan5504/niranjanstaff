import React from 'react';
import { MoreVertical, Mail, Phone, Download, Pencil, Trash2, Briefcase, Building2, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { StaffMember } from '../types/staff';
import { StaffDetailsModal } from './StaffDetailsModal';
import { AuthModal } from './AuthModal';

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onDownload: (staff: StaffMember) => void;
}

export function StaffCard({ staff, onEdit, onDelete }: StaffCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [authAction, setAuthAction] = React.useState<null | (() => void)>(null);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const requiredPassword = "admin@123"; // Replace with a secure password management system in production

  const handleAuthConfirm = (password: string) => {
    if (password === requiredPassword && authAction) {
      authAction(); // Execute the authenticated action
    } else {
      alert('Incorrect password');
    }
    setAuthAction(null);
  };

  const requestAuth = (action: () => void) => {
    setAuthAction(() => action);
    setShowAuthModal(true);
  };

  const downloadPDF = (staff: StaffMember) => {
    const doc = new jsPDF();

    const leftMargin = 20;
    const maxWidth = 180;
    let currentY = 20; // Start Y position
    const pageHeight = doc.internal.pageSize.height; // Page height

    // Add the image if available
    if (staff.imageUrl) {
        // Place the image at (150, 10) with dimensions (50x50)
        doc.addImage(staff.imageUrl, "JPEG", 150, 10, 50, 50);
    }

    // Function to check if content overflows and add a new page if needed
    const checkPageOverflow = () => {
        if (currentY >= pageHeight - 20) {
            doc.addPage();
            currentY = 20; // Reset Y position after adding a new page
        }
    };

    // Basic Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${staff.firstName} ${staff.lastName}`, leftMargin, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("ID:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.staffId}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFont('helvetica', 'bold');
    doc.text("Position:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.position}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFont('helvetica', 'bold');
    doc.text("Department:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.department}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFont('helvetica', 'bold');
    doc.text("Email:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.email}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFont('helvetica', 'bold');
    doc.text("Phone:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.phoneNumber}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    doc.setFont('helvetica', 'bold');
    doc.text("Status:", leftMargin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${staff.status}`, leftMargin + 30, currentY);
    currentY += 10;
    checkPageOverflow();

    // Bio
    doc.setFont('helvetica', 'bold');
    doc.text("Bio:", leftMargin, currentY);
    currentY += 6;
    checkPageOverflow();

    doc.setFont('helvetica', 'normal');
    const bioText = ` ${staff.bio}`;
    const splitBioText = doc.splitTextToSize(bioText, maxWidth);

    const pageWidth = doc.internal.pageSize.width;
    const centerX = pageWidth / 2;
    const firstLine = splitBioText[0];
    const textWidth = doc.getStringUnitWidth(firstLine) * doc.getFontSize() / doc.internal.scaleFactor;
    const x = centerX - textWidth / 2;
    doc.text(firstLine, x, currentY);
    currentY += 6;
    checkPageOverflow();

    for (let i = 1; i < splitBioText.length; i++) {
        doc.text(splitBioText[i], leftMargin, currentY, { align: 'justify' });
        currentY += 6;
        checkPageOverflow();
    }

    currentY += 10;

    // Education
    if (staff.education?.length) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Education", leftMargin, currentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        currentY += 10;
        checkPageOverflow();

        staff.education.forEach((edu) => {
            doc.text(`Degree: ${edu.degree}`, leftMargin, currentY);
            doc.text(`Field: ${edu.field}`, leftMargin, currentY + 10);
            doc.text(`Institution: ${edu.institution}`, leftMargin, currentY + 20);
            doc.text(`Year: ${edu.year}`, leftMargin, currentY + 30);
            currentY += 40;
            checkPageOverflow();
        });
    }

    // Experience
    if (staff.experience?.length) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Experience", leftMargin, currentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        currentY += 10;
        checkPageOverflow();

        staff.experience.forEach((exp) => {
            doc.text(`Company: ${exp.company}`, leftMargin, currentY);
            doc.text(`Title: ${exp.title}`, leftMargin, currentY + 10);
            doc.text(`Start Date: ${new Date(exp.startDate).toLocaleDateString()}`, leftMargin, currentY + 20);
            doc.text(`End Date: ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}`, leftMargin, currentY + 30);
            currentY += 40;
            checkPageOverflow();
        });
    }

    // Research
    if (staff.research?.length) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Research", leftMargin, currentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        currentY += 10;
        checkPageOverflow();

        staff.research.forEach((res, index) => {
            doc.text(`${index + 1}. ${res}`, leftMargin, currentY);
            currentY += 10;
            checkPageOverflow();
        });
    }

    // Save PDF
    doc.save(`${staff.firstName}_${staff.lastName}_Profile.pdf`);
};





  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowDetails(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={() => requestAuth(() => onEdit(staff))}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => requestAuth(() => downloadPDF(staff))}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Info (PDF)
                </button>
                <button
                  onClick={() => requestAuth(() => onDelete(staff.id))}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <img
            src={staff.imageUrl || 'https://drive.google.com/file/d/18631QWf9snKrdIHFfD7W34EFdd52vdbq/view?usp=drive_link'}
            alt={`${staff.firstName} ${staff.lastName}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">
              {staff.firstName} {staff.lastName}
            </h3>
            <p className="text-gray-500 text-sm">ID: {staff.staffId}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="text-sm">{staff.position}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="text-sm">{staff.department}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">{staff.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">{staff.phoneNumber}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Started {new Date(staff.startDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {showDetails && (
        <StaffDetailsModal
          staff={staff}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onConfirm={handleAuthConfirm}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
