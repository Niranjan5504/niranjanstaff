import React from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { UserPlus, Search, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { db } from './lib/firebase';
import { StaffCard } from './components/StaffCard';
import { StaffForm } from './components/StaffForm';
import type { StaffMember } from './types/staff';

function App() {
  const [staff, setStaff] = React.useState<StaffMember[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | undefined>();
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'staff'), (snapshot) => {
      const staffData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StaffMember[];
      setStaff(staffData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (data: Partial<StaffMember>) => {
    try {
      if (selectedStaff) {
        await updateDoc(doc(db, 'staff', selectedStaff.id), data);
        toast.success('Staff member updated successfully');
      } else {
        await addDoc(collection(db, 'staff'), data);
        toast.success('Staff member added successfully');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'staff', id));
        toast.success('Staff member deleted successfully');
      } catch (error) {
        toast.error('An error occurred');
        console.error('Error:', error);
      }
    }
  };

  const handleDownload = (staff: StaffMember) => {
    const data = JSON.stringify(staff, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${staff.staffId}-${staff.firstName}-${staff.lastName}-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredStaff = staff.filter((member) => {
    const searchString = searchTerm.toLowerCase();
    return (
      member.staffId.toLowerCase().includes(searchString) ||
      member.firstName.toLowerCase().includes(searchString) ||
      member.lastName.toLowerCase().includes(searchString) ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <button
            onClick={() => {
              setSelectedStaff(undefined);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Staff Member
          </button>
        </div>

        <div className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onEdit={(staff) => {
                setSelectedStaff(staff);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No staff members found matching your search.</p>
          </div>
        )}

        {showForm && (
          <StaffForm
            staff={selectedStaff}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setSelectedStaff(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;