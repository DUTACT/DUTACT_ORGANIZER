import { useNavigate } from 'react-router-dom'
import { getEventChangeHistory } from 'src/apis/eventChange'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import { useEventId } from 'src/hooks/useEventId'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { path } from 'src/routes/path'
import { EventSchemaType } from 'src/utils/rules'
import EventInformation from '../EventManagementDetails/components/EventInformation'
import { Tab, Tabs } from 'src/components/Tab'
import Popover from 'src/components/Popover'
import { useState } from 'react'
import UpdateEventDetails from './components/UpdateEventDetails'

type FormData = EventSchemaType

export default function UpdateEventPage() {
  const organizerId = useOrganizerId()
  const eventId = useEventId()
  const navigate = useNavigate()
  const [isOpenEditPopover, setIsOpenEditPopover] = useState(false)
  const [editOption, setEditOption] = useState<EditOption | null>(null)

  const { data: changes, error: changesError } = getEventChangeHistory(organizerId, eventId)

  if (changesError) {
    return <div>Error: {changesError.message}</div>
  }

  if (!changes) {
    return <div>Loading...</div>
  }

  const navigateToEventManagementPage = () => {
    navigate(path.event)
  }

  const handleEditOptionClick = (option: EditOption) => {
    switch (option) {
      case 'editEventInfo':
        console.log('Edit event info')
        break
      case 'renewRegistration':
        console.log('Renew registration')
        break
      case 'closeRegistration':
        console.log('Close registration')
        break
    }

    setIsOpenEditPopover(false)
  }

  return (
    <div className='px-6 py-3'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <div className='text-xl font-semibold text-neutral-8'>Chỉnh sửa sự kiện</div>
          <div className='text-sm font-normal text-neutral-5'>Chỉnh sửa thông tin sự kiện, xem lịch sử chỉnh sửa</div>
        </div>
        <div className='flex gap-2'>
          <Popover
            isOpen={isOpenEditPopover}
            onClose={() => setIsOpenEditPopover(false)}
            content={<EditOptionsPopover onEditOptionClick={handleEditOptionClick} />}
            containerClass='relative'
          >
            <Button
              onClick={() => setIsOpenEditPopover(true)}
              title='Chỉnh sửa'
              semantic='secondary'
              classButton='min-w-[150px]'
            ></Button>
          </Popover>
          <Button
            title='Quay lại'
            classButton='min-w-[100px] text-neutral-7 border-none bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
            onClick={navigateToEventManagementPage}
          />
        </div>
      </div>
      <Tabs>
        <Tab label='Thông tin sự kiện'>
          <EventInformation />
        </Tab>
        <Tab label='Lịch sử chỉnh sửa'>
          <div>
            <div>
              <h1 className='text-lg font-bold'>Lịch sử chỉnh sửa sự kiện</h1>
            </div>
            {changes.length === 0 && <div className='text-neutral-5'>Không có lịch sử chỉnh sửa</div>}
            {changes.length > 0 && (
              <table className='relative min-w-full overflow-auto'>
                <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
                  <tr>
                    <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                      Nội dung chỉnh sửa
                    </th>
                    <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                      Thời gian chỉnh sửa
                    </th>
                    <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                      Hành động
                    </th>
                  </tr>

                  <tr>
                    {changes.map((change) => (
                      <tr key={change.id}>
                        <td className='px-4 py-2 text-sm'>{change.details.type}</td>
                        <td className='px-4 py-2 text-sm'>{change.changedAt}</td>
                        <td className='px-4 py-2 text-sm'>Xem</td>
                      </tr>
                    ))}
                  </tr>
                </thead>
              </table>
            )}
          </div>
        </Tab>
        <Tab label='Thay đổi thông tin'>
          <UpdateEventDetails />
        </Tab>
      </Tabs>
    </div>
  )
}

interface EditOptionsPopoverProps {
  onEditOptionClick: (option: EditOption) => void
}

type EditOption = 'editEventInfo' | 'renewRegistration' | 'closeRegistration' | 'changeEventTime'

function EditOptionsPopover({ onEditOptionClick }: EditOptionsPopoverProps) {
  const options = [
    {
      title: 'Sửa thông tin',
      onClick: () => onEditOptionClick('editEventInfo')
    },
    {
      title: 'Thay đổi thời gian sự kiện',
      onClick: () => onEditOptionClick('changeEventTime')
    }
  ]
  return (
    <div className='absolute flex flex-col gap-2 rounded-md border border-neutral-4 bg-neutral-0 p-2'>
      {options.map((option) => (
        <div key={option.title} className='cursor-pointer rounded-md p-2 hover:bg-neutral-2' onClick={option.onClick}>
          {option.title}
        </div>
      ))}
    </div>
  )
}
