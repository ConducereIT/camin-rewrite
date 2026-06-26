import psycopg2
from psycopg2.extensions import parse_dsn
import datetime

def migrate_data():
    source_db = "dbname=rezervariCamin user=admin password=example host=172.27.0.3"
    target_db = "dbname=Rezervari-Camin user=admin password=example host=172.27.0.3"

    try:
        src_conn = psycopg2.connect(source_db)
        tgt_conn = psycopg2.connect(target_db)
        src_cur = src_conn.cursor()
        tgt_cur = tgt_conn.cursor()

        # 1. Run the JOIN query on the source
        join_query = """
            SELECT usr."userId", usr.email, usr."hashedPassword", usr."createdAt", usr."lastSignedIn",
            usr."authProvider", usr.verified, usr.name, usr."profilePictureUrl", info."userId", info.phone, info.camera
            FROM users AS usr
            LEFT JOIN "infoUser" AS info ON usr."userId" = info."userId"
        """
        src_cur.execute(join_query)
        rows = src_cur.fetchall()

        # 2. Iterate and perform multi-table inserts
        for row in rows:
            useId,usrEmail,usrPassword,usrCreateAt,usrLastSignedIn,usrAuthProvider,usrVerified,usrName,usrProfilePicture,infoUserId,infoUsrPhone,infoUsrCamera = row
            # print(usrEmail)
            # print(type(usrVerified))
            # # Insert into Table A
            tgt_cur.execute(
                """INSERT INTO "user" (id,name, email, "emailVerified",image,"updatedAt") VALUES (%s,%s, %s,%s,%s,%s) RETURNING id""",
                (useId,usrName, usrEmail,usrVerified,usrProfilePicture,datetime.datetime.now())
            )
            new_user_id = tgt_cur.fetchone()[0]

            if infoUsrPhone is not None :
            # Insert into Table B using the ID from Table A
                tgt_cur.execute(
                    """INSERT INTO  "infoUser"("userId", phone, camera) VALUES (%s, %s, %s)""",
                    (new_user_id, infoUsrPhone, infoUsrCamera)
                )

        tgt_conn.commit()
        print(f"Successfully migrated {len(rows)} records.")

    except Exception as e:
        print(f"Error: {e}")
        tgt_conn.rollback()
    finally:
        src_conn.close()
        tgt_conn.close()

if __name__ == "__main__":
    migrate_data()