import styles from "./Modal.module.css"

type Props = {
    children: React.ReactNode;
    open: boolean;
    setOpen: (value: boolean) => void;
}

export const Modal: React.FC<Props> = (props) => {
    const { children, open, setOpen } = props;
    if (open) {
        return (
            <div className={styles.container}
                onClick={() => setOpen(false)}>
                <div className={styles.content}
                    onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        )
    }

    return null
}