import React from 'react';
import { useGetSemesterQuery } from '@/store/api/v1/endpoints/semesters';
import { SemesterType } from '@/types/semester';

const SemesterCard: React.FC<{ id: number }> = ({ id }) => {
    const { data, isLoading, error } = useGetSemesterQuery({ id });
    const semester: SemesterType | undefined = data?.data;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading semester details</div>;
    }

    if (!semester) {
        return <div>No semester found with the given ID.</div>; 
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">{semester.name}</h2>
            <div className="text-gray-700">
                <p>
                    Start Date: <span className="font-semibold">{semester.start_time}</span>
                </p>
                <p>
                    End Date: <span className="font-semibold">{semester.end_time}</span>
                </p>
            </div>
        </div>
    );
};

export default SemesterCard;
