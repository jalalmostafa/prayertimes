import './autocomplete.css'

import { useRef, useState } from 'react'

export interface AutocompleteProps<T> {
    debounce?: number
    initialValue?: T
    fetchElements: (input: string) => Promise<T[]>
    onUserSelect: (v: T) => void
}

export interface AutocompleteElement {
    name: string
}

export function Autocomplete<T extends AutocompleteElement>(props: AutocompleteProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null)
    const [elements, setElements] = useState<T[]>([])
    const [value, setValue] = useState<T | undefined>(props.initialValue)

    const _onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async _ => {
        const value = inputRef.current?.value
        if (value) {
            if (props.debounce) {
                if (timerRef)
                    clearTimeout(timerRef)

                setTimerRef(setTimeout(async () => {
                    const elms = await props.fetchElements(value)
                    setElements(elms)
                }, props.debounce))
            } else {
                const elms = await props.fetchElements(value)
                setElements(elms)
            }
        }
    }

    const _onUserSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = Number(e.currentTarget.value)

        if (inputRef.current) {
            const element = elements[idx]
            inputRef.current.value = element.name
            props.onUserSelect(element)
            setValue(element)
            setElements([])
        }
    }

    const _lostFocus: React.FocusEventHandler<HTMLInputElement> = _ => {
        setElements([])
    }

    return (
        <div className="autocomplete">
            <span className="autocomplete-input-wrapper">
                <input ref={inputRef} type="text" className="autocomplete-input"
                    onKeyDown={_onKeyDown} onBlur={_lostFocus}
                    defaultValue={value?.name || props.initialValue?.name} />
            </span>
            <div className="autocomplete-elements">
                {
                    elements.length != 0 &&
                    <div className="autocomplete-options">
                        {elements.map((e, idx) => <span className="autocomplete-option" key={idx}>
                            <input type="radio" id={`option-${idx}`}
                                name="autocomplete-option"
                                defaultValue={idx} onChange={_onUserSelection} />
                            <label htmlFor={`option-${idx}`}>{e.name}</label><br />
                        </span>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}
