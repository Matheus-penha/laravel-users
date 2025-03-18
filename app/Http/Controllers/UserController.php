<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(){
        $users = User::orderByDesc('created_at')->get();

        return Inertia::render('Users', [
            'users' => UserResource::collection($users)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required | email | unique:users,email',
            'password' => 'required | min:8 | confirmed',
            'image' => 'sometimes | file | mimes:png, jpg, jpeg',
        ]);

        if($request->has('image')) {
            $fileUrl = $request->file('image')->store('profiles', 'public');
            $validated['avatar'] = $fileUrl;
        }

        User::create($validated);

        return back();
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' .$user->id,
            'image' => 'sometimes | file | mimes:png, jpg, jpeg',
        ]);
        
        if($request->has('image')) {
            $disk = Storage::disk('public');

            if($user->avatar && $disk->exists($user->avatar)){
                $disk->delete($user->avatar);
            }

            $fileUrl = $request->file('image')->store('profiles', 'public');
            $validated['avatar'] = $fileUrl;
        }

        $user->update($validated);

        return back();

    }

    public function update_status(User $user, Request $request) {
        $request->validate([
            'status'=> 'required | lowercase | in:block, activate'
        ]);

        $user->is_active = $request->status === 'activate';
        $user->save();

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return back();
    }
}
