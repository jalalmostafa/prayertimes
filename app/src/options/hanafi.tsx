import Switch from "rc-switch"
import { useEffect, useState } from "react"

import { store } from "../common/store"
import { i18n } from "../common/i18n-service"

export function HanafiAdjustments() {
    const [useHanafi, setUseHanafi] = useState<boolean>(false)

    useEffect(() => {
        const init = async () => {
            const hanafi = await store.hanafiAdjustments()
            setUseHanafi(hanafi)
        }
        init()
    }, [])

    const _changed = async (checked: boolean) => {
        await store.hanafiAdjustments(checked)
        store.notifyBackground()
        setUseHanafi(checked)
    }


    return (
        <div className="option-container">
            <span className="option-label-wrapper">
                <span className="option-label">{i18n.hanafiAdjustments}</span>
            </span>
            <span className="option-control">
                <span className="green small">
                    <Switch
                        checked={useHanafi}
                        checkedChildren=""
                        unCheckedChildren=""
                        onChange={_changed}
                    />
                </span>
            </span>
        </div>
    )

}