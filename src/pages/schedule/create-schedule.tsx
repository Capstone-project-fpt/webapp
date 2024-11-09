import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import SelectStudentGroup from './components/select-student-group';

const CreateReviewSchedule = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const durationInMinutes = parseInt(data.duration);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    console.log({
      ...data,
      duration: `${hours} hour(s) and ${minutes} minute(s)`,
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Review Schedule</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <Label htmlFor="reviewTitle">Review Title</Label>
            <Input id="reviewTitle" {...register('reviewTitle')} placeholder="Review lần 1" className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="evaluationGroup">Evaluation Committee Group</Label>
              <Input id="evaluationGroup" {...register('evaluationGroup')} placeholder="EC01" />
            </div>
            <div>
              <Label htmlFor="studentGroup">Student Group</Label>
              <SelectStudentGroup value={null} onChangeValue={function (newValue: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>): void {
                          throw new Error('Function not implemented.');
                      } } selectedGroup={[]}          />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" {...register('date')} type="date" />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" {...register('time')} type="time" />
            </div>
            <div>
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input id="duration" {...register('duration')} type="number" placeholder="Enter duration in minutes" />
            </div>
          </div>
         <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} placeholder="Location will be generated automatically" disabled />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows="6" placeholder="Enter description here..." className="w-full p-2 border rounded"></Textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Create</Button>
        </div>
    </div>
  );
};

export default CreateReviewSchedule;
