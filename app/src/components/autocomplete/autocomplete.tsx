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

    const _onKeyDown: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const value = e.currentTarget.value
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
        if (inputRef.current) {
            const idx = Number(e.currentTarget.value)
            const element = elements[idx]
            inputRef.current.value = element.name
            setElements([])
            props.onUserSelect(element)
        }
    }

    return (
        <div className="autocomplete">
            <span className="autocomplete-input-wrapper">
                <input type="text" className="autocomplete-input"
                    onChange={_onKeyDown} ref={inputRef}
                    defaultValue={props.initialValue?.name} />
            </span>
            <div className="autocomplete-elements">
                <div className="autocomplete-options">
                    {elements.map((e, idx) => <span className="autocomplete-option" key={idx}>
                        <input type="radio" id={`option-${idx}`}
                            name="autocomplete-option"
                            defaultValue={idx} onChange={_onUserSelection} />
                        <label htmlFor={`option-${idx}`}>{e.name}</label><br />
                    </span>
                    )}
                </div>
            </div>
        </div>
    )
}
