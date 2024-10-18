import { debounce } from 'lodash'
import { useMemo, useState } from 'react'
import SearchIcon from 'src/assets/icons/i-search.svg?react'
import { TIMEOUT } from 'src/constants/common'

interface Props {
  placeholder: string
  inputSearch: string
  setInputSearch: (value: string) => void
}

export default function InputSearch({ placeholder, inputSearch, setInputSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>(inputSearch)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setInputSearch(value), TIMEOUT.DEBOUNCE),
    [setInputSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <div className='flex w-full items-center gap-2 rounded-md border border-neutral-3 px-2 py-2'>
      <SearchIcon className='h-[20px] w-[20px]' />
      <input
        type='text'
        className='flex-1 text-sm font-medium text-neutral-6 outline-none placeholder:font-normal placeholder:text-neutral-5'
        value={searchTerm}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  )
}
