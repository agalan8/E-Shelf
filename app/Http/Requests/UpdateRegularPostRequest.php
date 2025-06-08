<?php

namespace App\Http\Requests;

use App\Models\RegularPost;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRegularPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $RegularPost = $this->route('regular_post');

         $RegularPost = RegularPost::findOrFail($RegularPost);

         return $this->user()->id === $RegularPost->post->user->id || $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
