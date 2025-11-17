import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type Friend = {
    name: string;
    age: number;
};

type FormValues = {
    friends: Friend[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical Check Up', href: '/mcu' },
    { title: 'Tambah', href: '/mcu/create' },
];

export default function Create() {
    const form = useForm<FormValues>({
        // langsung isi nilai awal, tidak pakai defaultValues
        friends: [],
    });

    // helper untuk update friend
    const updateFriend = (index: number, key: keyof Friend, value: unknown) => {
        form.setData((data) => {
            const newFriends = [...data.friends];
            newFriends[index] = { ...newFriends[index], [key]: value };
            return { friends: newFriends };
        });
    };

    // hapus friend
    const removeFriend = (index: number) => {
        form.setData((data) => {
            const newFriends = [...data.friends];
            newFriends.splice(index, 1);
            return { friends: newFriends };
        });
    };

    // tambah friend baru
    const addFriend = () => {
        form.setData((data) => ({
            friends: [...data.friends, { name: '', age: 0 }],
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/submit'); // ganti dengan endpoint kamu
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Medical Check Up" />

            <div className="max-w-5xl p-6">
                <h2 className="text-xl font-semibold">Tambah MCU</h2>
                <p className="mt-1 text-sm text-gray-500">Masukkan data mcu baru. Klik simpan untuk menyimpan data.</p>

                <form onSubmit={submit}>
                    <h2>Friends</h2>

                    {form.data.friends.map((friend, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input placeholder="Name" value={friend.name} onChange={(e) => updateFriend(index, 'name', e.target.value)} />
                            <input
                                type="number"
                                placeholder="Age"
                                value={friend.age}
                                onChange={(e) => updateFriend(index, 'age', Number(e.target.value))}
                            />
                            <button type="button" onClick={() => removeFriend(index)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addFriend}>
                        Add Friend
                    </button>

                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </AppLayout>
    );
}
