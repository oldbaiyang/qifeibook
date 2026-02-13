import styles from './BookCardSkeleton.module.css';

export default function BookCardSkeleton() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.coverWrapper}>
                <div className={styles.cover} />
            </div>
            <div className={styles.content}>
                <div className={styles.title} />
                <div className={styles.author} />
                <div className={styles.meta}>
                    <div className={styles.tag} />
                    <div className={styles.year} />
                </div>
            </div>
        </div>
    );
}
